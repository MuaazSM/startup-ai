// server/src/middleware/validation.js

const validate = (schema) => {
    return (req, res, next) => {
      try {
        // Combine all possible request data sources
        const dataToValidate = {
          ...req.body,
          ...req.params,
          ...req.query
        };
  
        // Validate data against schema
        const { error } = schema.validate(dataToValidate, {
          abortEarly: false, // Return all errors, not just the first one
          stripUnknown: true // Remove fields that aren't in the schema
        });
  
        if (error) {
          // Format validation errors
          const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
          }));
  
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
          });
        }
  
        // If validation passes, continue to next middleware
        next();
      } catch (err) {
        next(err);
      }
    };
  };
  
  // Common validation rules
  const commonValidations = {
    // User validation rules
    user: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      name: /^[a-zA-Z\s]{2,30}$/
    },
    
    // Query validation rules
    query: {
      page: /^\d+$/,
      limit: /^\d+$/,
      sort: /^[a-zA-Z_]+:(asc|desc)$/
    },
  
    // Sanitize input
    sanitize: (input) => {
      if (typeof input !== 'string') return input;
      return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove potential JavaScript
        .substring(0, 1000); // Limit length
    }
  };
  
  // Helper function to validate email
  const isValidEmail = (email) => {
    return commonValidations.user.email.test(email);
  };
  
  // Helper function to validate password
  const isValidPassword = (password) => {
    return commonValidations.user.password.test(password);
  };
  
  // Helper function to validate name
  const isValidName = (name) => {
    return commonValidations.user.name.test(name);
  };
  
  // Helper function to sanitize query parameters
  const sanitizeQuery = (query) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(query)) {
      sanitized[key] = commonValidations.sanitize(value);
    }
    return sanitized;
  };
  
  module.exports = {
    validate,
    commonValidations,
    isValidEmail,
    isValidPassword,
    isValidName,
    sanitizeQuery
  };