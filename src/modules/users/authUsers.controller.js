import { AuthService } from "./authUsers.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

export class AuthController extends BaseController {
  static signup = asyncHandler(async (req, res) => {
    const result = await AuthService.signup(req.body);

    this.sendSuccess(res, 201, "User created successfully✅", result);
  });

  static login = asyncHandler(async (req, res) => {
    const result = await AuthService.login(req.body);

    this.sendSuccess(res, 200, "Login successful", result);
  });

  static getProfile = asyncHandler(async (req, res) => {
    const user = await AuthService.getProfile(req.user.id);

    this.sendSuccess(res, 200, "Profile retrieved successfully", user);
  });

  static updateProfile = asyncHandler(async (req, res) => {
    const user = await AuthService.updateProfile(req.user.id, req.body);

    this.sendSuccess(res, 200, "Profile updated successfully", user);
  });

  static verifyEmail = asyncHandler(async (req, res) => {
    const result = await AuthService.verifyEmail(req.query.token);

    this.sendSuccess(res, 200, "Email verified successfully ✅", result);
  });

  static googleAuth = asyncHandler(async (req, res) => {
    const result = await AuthService.googleAuth(req.user);

    this.sendSuccess(res, 200, "User created successfuly✅", result);
  });
}

export const signup = AuthController.signup;
export const login = AuthController.login;
export const getProfile = AuthController.getProfile;
export const updateProfile = AuthController.updateProfile;
export const verifyEmail = AuthController.verifyEmail;
export const googleAuth = AuthController.googleAuth;
