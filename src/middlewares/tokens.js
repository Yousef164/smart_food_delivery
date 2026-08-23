import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwtSecret } from "../config/env.js";
import { ApiError, asyncHandler } from "./errorHandler.js";

export class TokenManager {
  static SECRET_KEY = jwtSecret;

  static EXPIRATION_TIME = "7d";

  static RANDOM_BYTES = 32;

  static TO_STRING = "hex";

  static generateToken(userId, email, role) {
    return jwt.sign({ id: userId, email, role }, this.SECRET_KEY, {
      expiresIn: this.EXPIRATION_TIME,
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, this.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError("Token has expired", 401);
      }
      throw new ApiError("Invalid token", 401);
    }
  }

  static extractToken(authHeader) {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    return parts[1];
  }

  static refreshToken(token) {
    const decoded = this.verifyToken(token);
    return this.generateToken(decoded.id, decoded.email);
  }

  static generateEmailToken() {
    return crypto.randomBytes(this.RANDOM_BYTES).toString(this.TO_STRING);
  }

  static verifyEmailToken(token, userToken) {
    return token === userToken;
  }
}

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = TokenManager.extractToken(authHeader);

  if (!token) {
    throw new ApiError("Access token required", 401);
  }

  try {
    const decoded = TokenManager.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Invalid token", 401);
  }
});

export const generateToken = (userId, email, role) => {
  if (!userId || !email) {
    throw new ApiError("User ID and email are required", 400);
  }
  return TokenManager.generateToken(userId, email, role);
};

export const generateEmailToken = () => {
  return TokenManager.generateEmailToken();
};

export const verifyEmailToken = (token, userToken) => {
  if (!token) {
    throw new ApiError("Invalid token", 401);
  }

  if (!userToken) {
    throw new ApiError("user is not verified", 401);
  }

  return TokenManager.verifyEmailToken(token, userToken);
};

export const isRestaurant = (token) => {
  return token.role == "restaurant";
};

export const isUser = (token) => {
  return token.role == "user";
};
