import { AddressService } from "./addresses.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class AddressController extends BaseController {
  static addAddress = asyncHandler(async (req, res) => {
    const result = await AddressService.addAddress(req.body, req.user);

    this.sendSuccess(res, 201, "create address successfully✅", result);
  });

  static getAddress = asyncHandler(async (req, res) => {
    const result = await AddressService.getAddress(req.query.id, req.user);

    this.sendSuccess(res, 200, "get address success", result);
  });

  static getAllAddresses = asyncHandler(async (req, res) => {
    const result = await AddressService.getAllAddresses(req.user);

    this.sendSuccess(res, 200, "get address success", result);
  });

  static deleteAddress = asyncHandler(async (req, res) => {
    const result = await AddressService.deleteAddress(req.query.id, req.user);

    this.sendSuccess(res, 200, "delete address success", result);
  });
}

export const addAddress = AddressController.addAddress;
export const getAddress = AddressController.getAddress;
export const getAllAddresses = AddressController.getAllAddresses;
export const deleteAddress = AddressController.deleteAddress;
