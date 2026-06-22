import { Cart, Product } from "../../models/index.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { Validator } from "../../utils/Validator.js";
import { isUser } from "../../middlewares/tokens.js";

export class CartService {
  static async createCart(data, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    const validation = Validator.validateCreateCart(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const product = await Product.findByPk(data.productId);
    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const quantity = Number(data.quantity);
    const price = Number(data.price);

    const [cartItem, created] = await Cart.findOrCreate({
      where: {
        userId: user.id,
        productId: data.productId,
      },
      defaults: {
        quantity,
        price,
      },
    });

    if (!created) {
      cartItem.quantity = cartItem.quantity + quantity;
      cartItem.price = price;
      await cartItem.save();
    }

    return cartItem;
  }

  static async updateCart(data, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    const validation = Validator.validateUpdateCart(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const cartItem = await Cart.findOne({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (!cartItem) {
      throw new ApiError("Cart item not found", 404);
    }

    const updates = {};
    if (data.quantity !== undefined) updates.quantity = Number(data.quantity);
    if (data.price !== undefined) updates.price = Number(data.price);

    await cartItem.update(updates);
    return cartItem;
  }

  static async deleteCart(cartId, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    if (!cartId) {
      throw new ApiError("Cart id is required", 400);
    }

    const cartItem = await Cart.findOne({
      where: {
        id: cartId,
        userId: user.id,
      },
    });

    if (!cartItem) {
      throw new ApiError("Cart item not found", 404);
    }

    await cartItem.destroy();
    return {
      message: "Cart item deleted successfully✅",
    };
  }

  static async getUserCart(user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    const items = await Cart.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    return {
      items,
    };
  }
}

export default CartService;
