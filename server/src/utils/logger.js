// server/src/utils/logger.js
const winston = require('winston');
const { MongoDB } = require('winston-mongodb');

// Create Winston logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console logging
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),

        // File logging
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

// Add MongoDB transport in production
if (process.env.NODE_ENV === 'production') {
    logger.add(new MongoDB({
        db: process.env.MONGODB_URI,
        collection: 'logs',
        level: 'error',
        options: { useUnifiedTopology: true }
    }));
}

// Chat interaction logging
const logChatInteraction = async (userId, message, response, context = []) => {
    logger.info('Chat Interaction', {
        userId,
        message,
        response: response.substring(0, 200), // Truncate long responses
        contextCount: context.length,
        timestamp: new Date()
    });
};

// Error logging
const logError = (error, context = {}) => {
    logger.error('Error occurred', {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date()
    });
};

// API request logging
const logAPIRequest = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('API Request', {
            method: req.method,
            path: req.path,
            duration,
            status: res.statusCode,
            userId: req.user?.id || 'anonymous',
            timestamp: new Date()
        });
    });
    next();
};

// Python service interaction logging
const logPythonServiceCall = (endpoint, data, response) => {
    logger.info('Python Service Interaction', {
        endpoint,
        requestData: data,
        responseStatus: response?.status || 'error',
        timestamp: new Date()
    });
};

module.exports = {
    logger,
    logChatInteraction,
    logError,
    logAPIRequest,
    logPythonServiceCall
};