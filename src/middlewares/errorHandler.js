
import { nodeEnv } from "../config/env.js";


export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}


export const errorHandler = (err, req, res, next) => {

  console.error("Error:", err.message);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: err.message || "خطأ داخلي في الخادم",

    ...(nodeEnv === "development" && { stack: err.stack }),
  });
};


export const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
