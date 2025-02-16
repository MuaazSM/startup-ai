const axios = require('axios');

class AnalysisService {
    constructor() {
        this.pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
    }

    async getStartupAdvice(query, userId) {
        try {
            const response = await axios.post(`${this.pythonServiceUrl}/api/startup/advice`, {
                query,
                userId
            });
            return response.data;
        } catch (error) {
            console.error('Error getting startup advice:', error);
            throw error;
        }
    }

    async getChatHistory(userId) {
        try {
            const response = await axios.get(`${this.pythonServiceUrl}/api/startup/history/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting chat history:', error);
            throw error;
        }
    }
}