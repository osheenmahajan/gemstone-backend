import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware.js';

/**
 * Middleware to protect routes. Ensures request has a valid JWT in Authorization header.
 */
export const protect = (req, res, next) => {
  try {
    let token;

    // Check if token exists in authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in. Please log in to get access.', 401)
      );
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return next(
            new AppError('Your session has expired. Please log in again.', 401)
          );
        }
        return next(
          new AppError('Invalid token. Please log in again.', 401)
        );
      }

      // Attach user information to request object
      // (Typically contains id, email, and role from the payload)
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    });
  } catch (error) {
    next(error);
  }
};
