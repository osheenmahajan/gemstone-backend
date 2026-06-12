import bcrypt from 'bcryptjs';

/**
 * Hash a plaintext password using bcrypt.
 * @param {string} password
 * @param {number} saltRounds
 */
export const hashPassword = async (password, saltRounds = 10) => {
  return bcrypt.hash(password, await bcrypt.genSalt(saltRounds));
};

