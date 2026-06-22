import { HomeService } from "./home.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class HomeController extends BaseController {
  static getHome = asyncHandler(async (req, res) => {
    const result = await HomeService.getHome();
    this.sendSuccess(res, 200, "Home page data retrieved successfully", result);
  });

  static getHomeRestaurants = asyncHandler(async (req, res) => {
    const result = await HomeService.getHomeRestaurants(req.query);
    this.sendSuccess(
      res,
      200,
      "Home restaurants retrieved successfully",
      result,
    );
  });

  static getHomeProducts = asyncHandler(async (req, res) => {
    const result = await HomeService.getHomeProducts(req.query);
    this.sendSuccess(res, 200, "Home products retrieved successfully", result);
  });
}

export const getHome = HomeController.getHome;
export const getHomeRestaurants = HomeController.getHomeRestaurants;
export const getHomeProducts = HomeController.getHomeProducts;
