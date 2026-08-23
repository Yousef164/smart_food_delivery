import { Product } from "../../models/index.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { Validator } from "../../utils/Validator.js";
import { isRestaurant } from "../../middlewares/tokens.js";

export class ProductsService {
  static async createProduct(data, user) {
    if (!isRestaurant(user)) {
      throw new ApiError("role Error", 400);
    }

    const validation = Validator.validateCreateProduct(data, user);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const productData = {
      restaurantId: data.restaurantId || user?.id,
      name: String(data.name).trim(),
      description: data.description ? String(data.description).trim() : null,
      catgory: String(data.catgory).trim(),
      image: data.image ? String(data.image).trim() : null,
      price: Number(data.price),
      isAvailable:
        data.isAvailable === undefined ? true : Boolean(data.isAvailable),
    };

    return await Product.create(productData);
  }

  static async getProduct(id) {
    if (!id) {
      throw new ApiError("Product id is required", 400);
    }

    const product = await Product.findByPk(id);
    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    return product;
  }

  static async updateProduct(data, user) {
    if (!data?.id) {
      throw new ApiError("Product id is required", 400);
    }

    const product = await Product.findByPk(data.id);
    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    if (user && product.restaurantId !== user.id) {
      throw new ApiError("Unauthorized to update this product", 403);
    }

    const updates = {};
    if (data.name !== undefined) updates.name = String(data.name).trim();
    if (data.description !== undefined)
      updates.description = data.description
        ? String(data.description).trim()
        : null;
    if (data.catgory !== undefined)
      updates.catgory = String(data.catgory).trim();
    if (data.image !== undefined)
      updates.image = data.image ? String(data.image).trim() : null;
    if (data.price !== undefined) updates.price = Number(data.price);
    if (data.isAvailable !== undefined)
      updates.isAvailable = Boolean(data.isAvailable);

    await product.update(updates);
    return product;
  }

  static async getProductRestaurant(data, user) {
    const restaurantId =
      data.restaurantId || (user && isRestaurant(user) ? user.id : null);

    if (!restaurantId) {
      throw new ApiError("Restaurant id is required", 400);
    }

    const validation = Validator.validateGetRestaurantProducts(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const limit = Number(data.limit) > 0 ? Number(data.limit) : 10;
    const page = Number(data.page) > 0 ? Number(data.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: { restaurantId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      products: rows,
      total: count,
      page,
      pages: Math.ceil(count / limit) || 0,
    };
  }
}
