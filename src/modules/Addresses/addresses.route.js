import express from "express";

import {
  addAddress,
  getAddress,
  getAllAddresses,
  deleteAddress,
} from "./addresses.controller.js";

import { verifyToken } from "../../middlewares/tokens.js";

const router = express.Router();

router.post("/add-address", verifyToken, addAddress);
router.get("/get-address", verifyToken, getAddress);
router.get("/get-all-addresses", verifyToken, getAllAddresses);
router.delete("/delete-address", verifyToken, deleteAddress);

export default router;
