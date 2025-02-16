// server/src/middleware/error.js

// Custom error handler middleware
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(err.stack);
  
    // Default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
  
    // Handle specific types of errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map(val => val.message).join(', ');
    }
  
    // Handle JWT specific errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
  
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }
  
    // Handle duplicate key errors (MongoDB)
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
    }
  
    // Handle cast errors (MongoDB)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Resource not found';
    }
  
    // Send error response
    res.status(statusCode).json({
      success: false,
      error: message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = errorHandler;