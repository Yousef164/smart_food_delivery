import bcrypt from "bcrypt";

/**
 * User Helper Methods
 * Contains utility methods for User model
 */

/**
 * Compare password with hashed password
 * @param {string} plainPassword - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Format user object for JSON response
 * Removes sensitive data like password
 * @param {object} user - User instance
 * @returns {object} - Safe user object
 */
export const formatUserResponse = (user) => {
  if (!user) return null;

  const userData = user.get ? user.get() : user;
  const { password, ...safeUser } = userData;
  return safeUser;
};
