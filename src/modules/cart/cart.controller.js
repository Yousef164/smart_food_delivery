import CartService from "./cart.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class CartController extends BaseController {
  static createCart = asyncHandler(async (req, res) => {
    const result = await CartService.createCart(req.body, req.user);
    this.sendSuccess(res, 201, "create cart item successfully✅", result);
  });

  static updateCart = asyncHandler(async (req, res) => {
    const result = await CartService.updateCart(req.body, req.user);
    this.sendSuccess(res, 200, "update cart item successfully✅", result);
  });

  static deleteCart = asyncHandler(async (req, res) => {
    const result = await CartService.deleteCart(req.query.id, req.user);
    this.sendSuccess(res, 200, "delete cart item successfully✅", result);
  });

  static getCart = asyncHandler(async (req, res) => {
    const result = await CartService.getUserCart(req.user);
    this.sendSuccess(res, 200, "get cart successfully✅", result);
  });
}

export const { createCart, updateCart, deleteCart, getCart } = CartController;
