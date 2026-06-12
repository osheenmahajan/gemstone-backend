import { logger } from './logger.middleware.js';

// Custom operational error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Centralized Express error handler middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  // Log detailed error and stack trace
  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack || 'N/A'}`
  );

  const response = {
    status,
    message,
  };

  // If there are validation errors or additional details (like express-validator results)
  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
