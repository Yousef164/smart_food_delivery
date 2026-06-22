import { BranchAddress } from "../../models/index.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { isRestaurant, isUser } from "../../middlewares/tokens.js";
import { Validator } from "../../utils/Validator.js";
import sequelize from "../../config/database.js";

export class BranchesService {
  SQL_QUERY = `
      SELECT *,
      (
        6371 * acos(
          cos(radians(:lat)) *
          cos(radians(lat)) *
          cos(radians(lng) - radians(:lng)) +
          sin(radians(:lat)) *
          sin(radians(lat))
        )
      ) AS distance
      FROM ${BranchAddress.tableName}

      ORDER BY distance
      LIMIT 1
      `;

  async createBranchAddress(data, user) {
    if (!isRestaurant(user)) {
      throw new ApiError("role error", 400);
    }

    const validation = Validator.validateBranchAddress(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const branchData = {
      restaurantId: user.id,
      address: String(data.address).trim(),
      lat: Number(data.lat),
      lng: Number(data.lng),
      phone: data.phone,
    };

    return await BranchAddress.create(branchData);
  }

  async nearestBranch(data, user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    const validation = Validator.validateNearestBranch(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const lat = Number(data.lat);
    const lng = Number(data.lng);

    const branches = await sequelize.query(this.SQL_QUERY, {
      replacements: { lat, lng },
      type: sequelize.QueryTypes.SELECT,
    });

    return branches?.[0] ?? null;
  }

  async deleteBranch(data, user) {
    if (!isRestaurant(user)) {
      throw new ApiError("role error", 400);
    }

    if (!data.id) {
      throw new ApiError("Branch id is required", 400);
    }

    const branch = await BranchAddress.findOne({
      where: { id: data.id, restaurantId: user.id },
    });

    if (!branch) {
      throw new ApiError("Branch not found", 404);
    }

    await branch.destroy();
    return { message: "Branch deleted successfully" };
  }
}

export default new BranchesService();
