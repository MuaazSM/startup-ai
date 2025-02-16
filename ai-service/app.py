from flask import Flask, request, jsonify
from flask_cors import CORS
from query_llm import get_response  # Your existing chatbot code

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

@app.route('/api/query', methods=['POST'])
def query():
    data = request.json
    query = data.get('query')
    user_id = data.get('userId')
    
    response = get_response(query, user_id)
    return jsonify(response)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    startup = data.get('startup')
    
    # Use your existing analysis code
    analysis = analyze_startup(startup)
    return jsonify(analysis)

if __name__ == '__main__':
    app.run(port=5000)