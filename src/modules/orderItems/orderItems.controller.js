import OrderItemsService from "./orderItems.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class OrderItemsController extends BaseController {
  static addItem = asyncHandler(async (req, res) => {
    const result = await OrderItemsService.addItem(req.body, req.user);
    this.sendSuccess(res, 201, "order item created successfully✅", result);
  });

  static updateItem = asyncHandler(async (req, res) => {
    const result = await OrderItemsService.updateItem(req.body, req.user);
    this.sendSuccess(res, 200, "order item updated successfully✅", result);
  });

  static deleteItem = asyncHandler(async (req, res) => {
    const result = await OrderItemsService.deleteItem(req.query.id, req.user);
    this.sendSuccess(res, 200, "order item deleted successfully✅", result);
  });

  static getByOrder = asyncHandler(async (req, res) => {
    const result = await OrderItemsService.getByOrder(
      req.query.orderId,
      req.user,
    );
    this.sendSuccess(res, 200, "order items fetched successfully✅", result);
  });
}

export const { addItem, updateItem, deleteItem, getByOrder } =
  OrderItemsController;
