import { Address } from "../../models/index.js";
import { Validator } from "../../utils/Validator.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { isUser } from "../../middlewares/tokens.js";

/**
 * addAddress
 * getAddress
 * getAllAddresses
 * deleteAddress
 *
 */

export class AddressService {
  static async addAddress(data, user) {
    if (!isUser(user)) {
      throw new ApiError("error role", 400);
    }

    const validation = Validator.validateAddress(data);
    if (!validation.isValid) {
      throw new ApiError("Validation failed", 400, validation.errors);
    }

    const addressData = {
      userId: user.id,
      lat: Number(data.lat),
      lng: Number(data.lng),
      fullAddress: String(data.fullAddress).trim(),
    };

    return await Address.create(addressData);
  }

  static async getAddress(addressId, user) {
    if (!addressId) {
      throw new ApiError("this address is not exist", 404);
    }

    const address = await Address.findOne({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!address) {
      throw new ApiError("Address not found", 404);
    }

    return {
      address,
    };
  }

  static async getAllAddresses(user) {
    if (!isUser(user)) {
      throw new ApiError("role error", 400);
    }

    const addresses = await Address.findAll({
      where: {
        userId: user.id,
      },
    });

    return {
      addresses,
    };
  }

  static async deleteAddress(addressId, user) {
    if (!addressId) {
      throw new ApiError("this address is not exist", 404);
    }

    const address = await Address.findOne({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!address) {
      throw new ApiError("Address not found", 404);
    }

    await address.destroy();

    return {
      message: "Address deleted successfully✅",
    };
  }
}
