import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) with the user ID.
 * 
 * @param {string} id - User ID payload
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
