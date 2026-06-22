import { OrderItem, Order, Product } from "../../models/index.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { isUser } from "../../middlewares/tokens.js";

export class OrderItemsService {
  static async addItem(data, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    if (!data || !data.orderId || !data.productId) {
      throw new ApiError("orderId and productId are required", 400);
    }

    const order = await Order.findByPk(data.orderId);
    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    if (order.userId !== user.id) {
      throw new ApiError("Unauthorized to add items to this order", 403);
    }

    const product = await Product.findByPk(data.productId);
    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const quantity = Number(data.quantity) > 0 ? Number(data.quantity) : 1;
    const price = data.price ? Number(data.price) : Number(product.price || 0);

    const created = await OrderItem.create({
      orderId: data.orderId,
      productId: data.productId,
      quantity,
      price,
    });

    return created;
  }

  static async updateItem(data, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    if (!data || !data.id) {
      throw new ApiError("id is required", 400);
    }

    const item = await OrderItem.findByPk(data.id);
    if (!item) {
      throw new ApiError("Order item not found", 404);
    }

    const order = await Order.findByPk(item.orderId);
    if (!order || order.userId !== user.id) {
      throw new ApiError("Unauthorized to update this item", 403);
    }

    const updates = {};
    if (data.quantity !== undefined) updates.quantity = Number(data.quantity);
    if (data.price !== undefined) updates.price = Number(data.price);

    await item.update(updates);
    return item;
  }

  static async deleteItem(id, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    const item = await OrderItem.findByPk(id);
    if (!item) {
      throw new ApiError("Order item not found", 404);
    }

    const order = await Order.findByPk(item.orderId);
    if (!order || order.userId !== user.id) {
      throw new ApiError("Unauthorized to delete this item", 403);
    }

    await item.destroy();
    return { message: "Order item deleted successfully✅" };
  }

  static async getByOrder(orderId, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    if (!orderId) {
      throw new ApiError("orderId is required", 400);
    }

    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== user.id) {
      throw new ApiError("Unauthorized or order not found", 403);
    }

    const items = await OrderItem.findAll({
      where: { orderId },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    return { items };
  }
}

export default OrderItemsService;
