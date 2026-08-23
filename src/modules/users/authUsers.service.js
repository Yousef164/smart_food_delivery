import User from "../../models/User.js";
import { generateToken, generateEmailToken } from "../../middlewares/tokens.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { Validator } from "../../utils/Validator.js";
import sendVerificationEmail from "../../utils/mailer.js";
import {
  comparePassword,
  formatUserResponse,
} from "../../utils/UserHelpers.js";

export class AuthService {
  static async signup(userData) {
    // Validate input data
    const validation = Validator.validateSignupData(userData);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const { fullName, email, phone, password } = userData;

    // Sanitize email
    const sanitizedEmail = Validator.sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: sanitizedEmail },
    });
    if (existingUser) {
      throw new ApiError("User with this email already exists", 409);
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        throw new ApiError("User with this phone number already exists", 409);
      }
    }

    const emailToken = generateEmailToken();

    // Create new user
    try {
      const user = await User.create({
        fullName,
        email: sanitizedEmail,
        password,
        phone: Validator.sanitizeString(phone),
        emailToken,
      });

      // Send verification email
      await sendVerificationEmail(fullName, sanitizedEmail, emailToken);

      return {
        user: formatUserResponse(user),
      };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const field = error.errors[0]?.path || "email";
        throw new ApiError(`${field} already exists`, 409);
      }
      throw error;
    }
  }

  static async login(credentials) {
    // Validate input data
    const validation = Validator.validateLoginData(credentials);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const { email, password } = credentials;

    // Sanitize email
    const sanitizedEmail = Validator.sanitizeEmail(email);

    // Find user
    const user = await User.findOne({ where: { email: sanitizedEmail } });
    if (!user) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Verify email
    if (!user.verifyEmail) {
      throw new ApiError("The email address was not verified", 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Generate token
    const token = generateToken(user.id, user.email, "user");

    return {
      user: formatUserResponse(user),
      token,
    };
  }

  static async getProfile(userId) {
    if (!userId) {
      throw new ApiError("User ID is required", 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    return formatUserResponse(user);
  }

  static async googleAuth({ id, email }) {
    if (!id || !email) {
      throw new ApiError("expired Token", 400);
    }

    const user = User.findOne({ where: { id } });

    if (!user) {
      throw new ApiError("this user is not exist❌", 400);
    }

    const token = generateToken(id, email);

    return { token, message: "login success✅" };
  }

  static async updateProfile(userId, updateData) {
    if (!userId) {
      throw new ApiError("User ID is required", 400);
    }

    const validation = Validator.validateProfileUpdate(updateData);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const allowedFields = ["fullName", "phone"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = Validator.sanitizeString(updateData[field]);
      }
    });

    // Check if phone is being updated and is unique
    if (updates.phone && updates.phone !== user.phone) {
      const existingPhone = await User.findOne({
        where: { phone: updates.phone },
      });
      if (existingPhone) {
        throw new ApiError("Phone number already exists", 409);
      }
    }

    // Update user
    try {
      await user.update(updates);
      return formatUserResponse(user);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new ApiError("Duplicate value for unique field", 409);
      }
      throw error;
    }
  }

  static async verifyEmail(token) {
    if (!token) {
      throw new ApiError("Token not found", 404);
    }

    const user = await User.findOne({ where: { emailToken: token } });

    if (!user) {
      throw new ApiError("Invalid token", 404);
    }

    user.verifyEmail = true;
    user.emailToken = null;
    await user.save();

    return {
      message: "Email verified successfully",
    };
  }
}

// Export individual functions for backward compatibility
export const signupService = (userData) => AuthService.signup(userData);
export const loginService = (credentials) => AuthService.login(credentials);
export const getProfileService = (userId) => AuthService.getProfile(userId);
export const updateProfileService = (userId, updateData) =>
  AuthService.updateProfile(userId, updateData);
export const verifyEmail = (token) => AuthService.verifyEmail(token);
