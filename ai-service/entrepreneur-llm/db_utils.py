# db_utils.py
from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict
import os
from dotenv import load_dotenv

class ConversationLogger:
    def __init__(self):
        """Initialize MongoDB connection"""
        load_dotenv()
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
        self.client = MongoClient(mongo_uri)
        self.db = self.client["startup_advisor"]
        self.conversations = self.db["conversations"]
        self.user_history = self.db["user_history"]
        
    def log_conversation(self, user_id: str, query: str, context_used: List[Dict], 
                        response: str, thought_process: str = None):
        """Log a conversation entry with chain of thought"""
        conversation_entry = {
            "user_id": user_id,
            "timestamp": datetime.utcnow(),
            "query": query,
            "context_used": context_used,
            "response": response,
            "thought_process": thought_process
        }
        
        # Insert into conversations collection
        self.conversations.insert_one(conversation_entry)
        
        # Update user history summary
        self.user_history.update_one(
            {"user_id": user_id},
            {
                "$push": {
                    "conversations": {
                        "timestamp": conversation_entry["timestamp"],
                        "query": query,
                        "summary": response[:200] + "..."  # Store truncated response as summary
                    }
                },
                "$inc": {"total_queries": 1},
                "$setOnInsert": {"first_interaction": datetime.utcnow()}
            },
            upsert=True
        )
        
    def get_user_history(self, user_id: str, limit: int = 5) -> List[Dict]:
        """Get recent conversation history for a user"""
        return list(
            self.conversations.find(
                {"user_id": user_id},
                {"query": 1, "response": 1, "timestamp": 1, "thought_process": 1}
            )
            .sort("timestamp", -1)
            .limit(limit)
        )
    
    def get_user_summary(self, user_id: str) -> Dict:
        """Get summary of user's interactions"""
        return self.user_history.find_one({"user_id": user_id})

    def add_thought_process(self, user_id: str, query: str, 
                          thought_process: str):
        """Add or update thought process for a conversation"""
        self.conversations.update_one(
            {
                "user_id": user_id,
                "query": query,
                "timestamp": {
                    "$gte": datetime.utcnow().replace(
                        hour=0, minute=0, second=0, microsecond=0
                    )
                }
            },
            {"$set": {"thought_process": thought_process}},
            upsert=True
        )