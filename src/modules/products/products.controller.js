import { ProductsService } from "./products.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class Products extends BaseController {
  static createProduct = asyncHandler(async (req, res) => {
    const result = await ProductsService.createProduct(req.body, req.user);

    this.sendSuccess(res, 201, "product created successfuly✅", result);
  });

  static getProduct = asyncHandler(async (req, res) => {
    const result = await ProductsService.getProduct(req.query.id);

    this.sendSuccess(res, 200, "product retrieved successfuly✅", result);
  });

  static getProductRestaurant = asyncHandler(async (req, res) => {
    const result = await ProductsService.getProductRestaurant(
      req.query,
      req.user,
    );

    this.sendSuccess(
      res,
      200,
      "restaurant products retrieved successfuly✅",
      result,
    );
  });

  static updateProduct = asyncHandler(async (req, res) => {
    const result = await ProductsService.updateProduct(req.body, req.user);

    this.sendSuccess(res, 200, "product updated successfuly✅", result);
  });
}

export const createProduct = Products.createProduct;
export const getProduct = Products.getProduct;
export const getProductRestaurant = Products.getProductRestaurant;
export const updateProduct = Products.updateProduct;
