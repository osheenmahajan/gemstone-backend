import bcrypt from 'bcryptjs';

/**
 * Compare plaintext password to bcrypt hash.
 * @param {string} password
 * @param {string} hash
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

