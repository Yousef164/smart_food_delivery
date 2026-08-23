import branchesService from "./branches.service.js";
import { BaseController } from "../../utils/BaseController.js";
import { asyncHandler } from "../../middlewares/errorHandler.js";

class BranchesController extends BaseController {
  static createBranchAddress = asyncHandler(async (req, res) => {
    const result = await branchesService.createBranchAddress(
      req.body,
      req.user,
    );

    this.sendSuccess(res, 201, "create Branch Address success✅", result);
  });

  static nearestBranch = asyncHandler(async (req, res) => {
    const result = await branchesService.nearestBranch(req.query, req.user);

    this.sendSuccess(res, 200, "this is a nearest branch", result);
  });

  static deleteBranch = asyncHandler(async (req, res) => {
    const result = await branchesService.deleteBranch(req.query, req.user);

    this.sendSuccess(res, 200, "delete branch address successfuly✅", result);
  });
}

export const createBranchAddress = BranchesController.createBranchAddress;
export const nearestBranch = BranchesController.nearestBranch;
export const deleteBranch = BranchesController.deleteBranch;
