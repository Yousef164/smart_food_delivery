import { Product, Restaurant } from "../../models/index.js";

export class HomeService {
  static async getHome() {
    return {
      title: "Smart Food Delivery Home",
      message: "Welcome to the Smart Food Delivery home page",
      routes: ["/home/restaurants", "/home/products"],
    };
  }

  static async getHomeRestaurants(data = {}) {
    const limit = Number(data.limit) > 0 ? Number(data.limit) : 10;
    const page = Number(data.page) > 0 ? Number(data.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Restaurant.findAndCountAll({
      where: { verifyEmail: true },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      restaurants: rows,
      total: count,
      page,
      pages: Math.ceil(count / limit) || 0,
    };
  }

  static async getHomeProducts(data = {}) {
    const limit = Number(data.limit) > 0 ? Number(data.limit) : 10;
    const page = Number(data.page) > 0 ? Number(data.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: { isAvailable: true },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["id", "restaurantName", "businessEmail"],
        },
      ],
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

export default HomeService;
