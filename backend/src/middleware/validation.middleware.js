import { validationResult } from 'express-validator';

/**
 * Middleware wrapper to execute validation chains and handle errors.
 * 
 * @param {Array} validations - Array of validation rules (e.g. body('email').isEmail())
 * @returns {Function} Express middleware function
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation rules asynchronously
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Map errors into a clean, uniform format
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
      location: err.location,
    }));

    // Construct a validation error to be processed by the centralized error handler
    const validationError = new Error('Validation failed');
    validationError.statusCode = 400;
    validationError.status = 'fail';
    validationError.errors = formattedErrors;

    next(validationError);
  };
};
