// server/src/utils/helper.js
const axios = require('axios');

// Chat history formatting
const formatChatHistory = (history) => {
    return history.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
    }));
};

// Python service communication
const callPythonService = async (endpoint, data) => {
    try {
        const response = await axios.post(
            `${process.env.PYTHON_SERVICE_URL}${endpoint}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Python service error:', error);
        throw new Error('Failed to communicate with AI service');
    }
};

// Response formatting
const formatResponse = (aiResponse, contextUsed = []) => {
    return {
        message: aiResponse,
        context: contextUsed,
        timestamp: new Date()
    };
};

// Error handling
const handleError = (error, defaultMessage = 'An error occurred') => {
    console.error('Error details:', error);
    return {
        success: false,
        message: error.message || defaultMessage,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
    return id.match(/^[0-9a-fA-F]{24}$/);
};

module.exports = {
    formatChatHistory,
    callPythonService,
    formatResponse,
    handleError,
    isValidObjectId
};