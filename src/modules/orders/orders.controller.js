import OrderService from "./orders.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class OrderController extends BaseController {
  static createOrder = asyncHandler(async (req, res) => {
    const result = await OrderService.createOrder(req.user, req.body);

    this.sendSuccess(res, 201, "create order successfully✅", result);
  });

  static confirmPayment = asyncHandler(async (req, res) => {
    const result = await OrderService.confirmPayment(req.body);

    this.sendSuccess(res, 200, "Payment confirmed successfully✅", result);
  });

  static cancelOrder = asyncHandler(async (req, res) => {
    const result = await OrderService.cancelOrder(req.user, req.body)

    this.sendSuccess(res, 200, "Order canceled successfully✅")
  })
}

export const { createOrder, confirmPayment, cancelOrder } = OrderController;
