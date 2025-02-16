# db_schema.py
from pymongo import MongoClient, ASCENDING
from datetime import datetime, UTC
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

class DatabaseManager:
    def __init__(self):
        """Initialize database connection"""
        load_dotenv()
        self.client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))
        self.db = self.client.startup_advisor
        
        # Initialize collections
        self.users = self.db.users
        self.thought_history = self.db.thought_history
        
        # Create indexes
        self._create_indexes()
        
    def _create_indexes(self):
        """Create necessary indexes for performance"""
        # Unique email index
        self.users.create_index([("email", ASCENDING)], unique=True)
        
        # Compound index for thought history
        self.thought_history.create_index([
            ("user_id", ASCENDING),
            ("timestamp", ASCENDING)
        ])
        
    def create_user(self, email: str, password_hash: str) -> str:
        """Create a new user"""
        try:
            now = datetime.now(UTC)
            result = self.users.insert_one({
                "email": email,
                "password_hash": password_hash,
                "created_at": now,
                "last_login": now
            })
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            raise
            
    def add_thought_history(self, user_id: str, prompt: str, 
                          response: str, context_used: Optional[List[Dict]] = None) -> str:
        """Add a new thought history entry"""
        try:
            result = self.thought_history.insert_one({
                "user_id": user_id,
                "timestamp": datetime.now(UTC),
                "prompt": prompt,
                "response": response,
                "context_used": context_used or [],
                "metadata": {
                    "source": "gpt-4",
                    "response_length": len(response)
                }
            })
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error adding thought history: {str(e)}")
            raise
            
    def get_user_history(self, user_id: str, 
                        limit: int = 10, 
                        skip: int = 0) -> List[Dict]:
        """Get user's thought history"""
        try:
            return list(self.thought_history
                       .find({"user_id": user_id})
                       .sort("timestamp", -1)
                       .skip(skip)
                       .limit(limit))
        except Exception as e:
            print(f"Error retrieving history: {str(e)}")
            return []
            
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email"""
        return self.users.find_one({"email": email})
        
    def update_last_login(self, user_id: str):
        """Update user's last login timestamp"""
        self.users.update_one(
            {"_id": user_id},
            {"$set": {"last_login": datetime.now(UTC)}}
        )
        
    def delete_user_data(self, user_id: str):
        """Delete all user data"""
        self.users.delete_one({"_id": user_id})
        self.thought_history.delete_many({"user_id": user_id})

# Test the schema
def test_database():
    print("Testing Database Connection and Operations...")
    db = DatabaseManager()
    
    try:
        # Test user creation
        test_email = "test@example.com"
        print(f"\nCreating test user with email: {test_email}")
        test_user_id = db.create_user(
            test_email,
            "hashed_password_here"
        )
        print(f"✅ Created user with ID: {test_user_id}")
        
        # Test adding thought history
        print("\nAdding test thought history...")
        thought_id = db.add_thought_history(
            test_user_id,
            "How do I validate my startup idea?",
            "Here's a detailed response...",
            [{"source": "case_study_1", "relevance": 0.95}]
        )
        print(f"✅ Added thought history with ID: {thought_id}")
        
        # Test retrieving history
        print("\nRetrieving user history...")
        history = db.get_user_history(test_user_id)
        print(f"✅ Found {len(history)} history entries")
        
        # Clean up test data
        print("\nCleaning up test data...")
        db.delete_user_data(test_user_id)
        print("✅ Test data cleaned up successfully")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
    
if __name__ == "__main__":
    test_database()