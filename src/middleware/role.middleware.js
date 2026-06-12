import { AppError } from './error.middleware.js';

/**
 * Middleware generator to restrict access to specific roles.
 * NOTE: Must be chained after the auth/protect middleware.
 * 
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'gemologist', 'user')
 * @returns {Function} Express middleware function
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Ensure user object is present (populated by authentication middleware)
    if (!req.user) {
      return next(
        new AppError('Authentication required. Access denied.', 401)
      );
    }

    // Check if user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};
