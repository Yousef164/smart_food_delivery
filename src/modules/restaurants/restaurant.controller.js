import { AuthService } from "./restaurant.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class AuthController extends BaseController {
  static signup = asyncHandler(async (req, res) => {
    const result = await AuthService.signup(req.body);

    this.sendSuccess(res, 201, "Profile created successfully✅", result);
  });

  static login = asyncHandler(async (req, res) => {
    const result = await AuthService.login(req.body);

    this.sendSuccess(res, 200, "Login successfully✅", result);
  });

  static verifyEmail = asyncHandler(async (req, res) => {
    const result = await AuthService.verifyEmail(req.query.token);

    this.sendSuccess(res, 200, "Email verified successfully✅", result);
  });

  static getRestaurantProfile = asyncHandler(async (req, res) => {
    const profile = await AuthService.getRestaurantProfile(req.user.id);

    this.sendSuccess(res, 200, "Profile retrieved successfully", profile);
  });

  static getAllRestaurants = asyncHandler(async (req, res) => {
    const result = await AuthService.getAllRestaurants(req.query, req.user);

    this.sendSuccess(res, 200, "some restaurants", result);
  });

  static searchRestaurant = asyncHandler(async (req, res) => {
    const result = await AuthService.searchRestaurant(req.query, req.user);

    this.sendSuccess(res, 200, "Search results retrieved successfully", result);
  });

  static updateRestaurantProfile = asyncHandler(async (req, res) => {
    const profile = await AuthService.updateRestaurantProfile(
      req.user.id,
      req.body,
    );

    this.sendSuccess(res, 200, "Profile updated successfully✅", profile);
  });
}

export const signup = AuthController.signup;
export const login = AuthController.login;
export const verifyEmail = AuthController.verifyEmail;
export const getRestaurantProfile = AuthController.getRestaurantProfile;
export const getAllRestaurants = AuthController.getAllRestaurants;
export const searchRestaurant = AuthController.searchRestaurant;
export const updateRestaurantProfile = AuthController.updateRestaurantProfile;
