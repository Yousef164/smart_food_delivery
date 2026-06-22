import express from "express";

import { verifyToken } from "../../middlewares/tokens.js";

import {
  createBranchAddress,
  nearestBranch,
  deleteBranch,
} from "./branches.controller.js";

const router = express.Router();

router.post("/create-branch-address", verifyToken, createBranchAddress);
router.get("/nearest-branch", verifyToken, nearestBranch);
router.delete("/delete-branch", verifyToken, deleteBranch);

export default router;
