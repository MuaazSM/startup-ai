const axios = require('axios');

class OpenAIService {
    constructor() {
        this.pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    async generateResponse(prompt, userId) {
        try {
            const response = await axios.post(`${this.pythonServiceUrl}/api/query`, {
                query: prompt,
                userId: userId
            }, { headers: this.headers });

            return response.data;
        } catch (error) {
            console.error('Error in OpenAI service:', error);
            throw error;
        }
    }

    async analyzeStartup(startupData) {
        try {
            const response = await axios.post(`${this.pythonServiceUrl}/api/analyze`, {
                startup: startupData
            }, { headers: this.headers });

            return response.data;
        } catch (error) {
            console.error('Error analyzing startup:', error);
            throw error;
        }
    }
}

// Export an instance of the class
module.exports = new OpenAIService();