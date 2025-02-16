from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from langchain_openai import ChatOpenAI


# Load environment variables
load_dotenv()

# Flask App Setup
app = Flask(__name__)

# LangChain GPT-4 Model Setup
api_key = os.getenv("OPENAI_API_KEY")
llm = ChatOpenAI(
    model_name="gpt-4",
    temperature=0.7,
    openai_api_key=api_key
)




# 🟡 Root Route (GET)
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to Startup-AI Chatbot API 🚀",
        "endpoints": {
            "POST /api/chat": "Get AI responses for startup questions"
        }
    })

# 🟡 Chat Route (POST)
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    # Get AI response from LangChain
    response = llm.predict(f"Provide startup advice for: {user_message}")
    return jsonify({"reply": response})

# Start Flask server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
