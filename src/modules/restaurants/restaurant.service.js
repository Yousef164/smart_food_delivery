import { Restaurant } from "../../models/index.js";
import { Op } from "sequelize";
import { ApiError } from "../../middlewares/errorHandler.js";
import { Validator } from "../../utils/Validator.js";
import {
  generateEmailToken,
  generateToken,
  isUser,
} from "../../middlewares/tokens.js";
import sendVerificationEmail from "../../utils/mailer.js";
import {
  comparePassword,
  formatUserResponse,
} from "../../utils/UserHelpers.js";

export class AuthService {
  static async signup(restaurantData) {
    const validation = Validator.validateRestaurantSignupData(restaurantData);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const {
      owner,
      restaurantName,
      description,
      businessEmail,

      password,
    } = restaurantData;

    const sanitizedEmail = Validator.sanitizeEmail(businessEmail);

    const existingRestaurant = await Restaurant.findOne({
      where: { businessEmail: sanitizedEmail },
    });
    if (existingRestaurant) {
      throw new ApiError("This restaurant with this email already exists", 409);
    }

    const emailToken = generateEmailToken();

    const restaurant = await Restaurant.create({
      ownerName: Validator.sanitizeString(owner),
      restaurantName: Validator.sanitizeString(restaurantName),
      description: description?.trim(),
      businessEmail: sanitizedEmail,
      password,
      emailToken,
    });

    await sendVerificationEmail(owner, sanitizedEmail, emailToken);

    return {
      restaurantData: formatUserResponse(restaurant),
    };
  }

  static async login(restaurantData) {
    const validation = Validator.validateLoginData(restaurantData);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const { email, password } = restaurantData;
    const sanitizedEmail = Validator.sanitizeEmail(email);

    const restaurant = await Restaurant.findOne({
      where: { businessEmail: sanitizedEmail },
    });
    if (!restaurant) {
      throw new ApiError("Invalid email or password", 401);
    }

    if (!restaurant.verifyEmail) {
      throw new ApiError("The email address was not verified", 401);
    }

    const isPasswordValid = await comparePassword(
      password,
      restaurant.password,
    );
    if (!isPasswordValid) {
      throw new ApiError("Invalid email or password", 401);
    }

    const token = generateToken(
      restaurant.id,
      restaurant.businessEmail,
      "restaurant",
    );

    return {
      restaurant: formatUserResponse(restaurant),
      token,
    };
  }

  static async getRestaurantProfile(restaurantId) {
    if (!restaurantId) {
      throw new ApiError("Restaurant ID is required", 400);
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new ApiError("Restaurant not found", 404);
    }

    return formatUserResponse(restaurant);
  }

  static async updateRestaurantProfile(restaurantId, updateData) {
    if (!restaurantId) {
      throw new ApiError("Restaurant ID is required", 400);
    }

    const validation = Validator.validateRestaurantProfileUpdate(updateData);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new ApiError("Restaurant not found", 404);
    }

    const updates = {};

    if (updateData.owner) {
      updates.ownerName = Validator.sanitizeString(updateData.owner);
    }
    if (updateData.ownerName) {
      updates.ownerName = Validator.sanitizeString(updateData.ownerName);
    }
    if (updateData.restaurantName) {
      updates.restaurantName = Validator.sanitizeString(
        updateData.restaurantName,
      );
    }
    if (updateData.description !== undefined) {
      updates.description = updateData.description?.trim();
    }
    if (updateData.isOpen !== undefined) {
      updates.isOpen = Boolean(updateData.isOpen);
    }

    if (
      updates.restaurantName &&
      updates.restaurantName !== restaurant.restaurantName
    ) {
      const existingRestaurant = await Restaurant.findOne({
        where: { restaurantName: updates.restaurantName },
      });
      if (existingRestaurant) {
        throw new ApiError("Restaurant name already exists", 409);
      }
    }

    await restaurant.update(updates);
    return formatUserResponse(restaurant);
  }

  static async getAllRestaurants(data, user) {
    if (!isUser(user)) {
      throw new ApiError("role Error", 400);
    }

    const validation = Validator.validateGetAllRestaurants(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const limit = Number(data.limit) > 0 ? Number(data.limit) : 10;
    const page = Number(data.page) > 0 ? Number(data.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Restaurant.findAndCountAll({
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

  static async searchRestaurant(data, user) {
    if (!isUser(user)) {
      throw new ApiError("role Error", 400);
    }

    const validation = Validator.validateSearchRestaurant(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const searchQuery = Validator.sanitizeString(
      data.query || data.q || data.search,
    );
    const limit = Number(data.limit) > 0 ? Number(data.limit) : 10;
    const page = Number(data.page) > 0 ? Number(data.page) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await Restaurant.findAndCountAll({
      where: {
        [Op.or]: [
          { restaurantName: { [Op.like]: `%${searchQuery}%` } },
          { ownerName: { [Op.like]: `%${searchQuery}%` } },
          { businessEmail: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
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

  static async verifyEmail(token) {
    if (!token) {
      throw new ApiError("Token not found", 404);
    }

    const restaurant = await Restaurant.findOne({
      where: { emailToken: token },
    });
    if (!restaurant) {
      throw new ApiError("Invalid token", 404);
    }

    restaurant.verifyEmail = true;
    restaurant.emailToken = null;
    await restaurant.save();

    return {
      message: "Email verified successfully",
    };
  }
}

export default AuthService;
