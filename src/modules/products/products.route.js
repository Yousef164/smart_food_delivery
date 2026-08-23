import express from "express";

import {
  createProduct,
  getProduct,
  getProductRestaurant,
  updateProduct,
} from "./products.controller.js";
import { verifyToken } from "../../middlewares/tokens.js";

const router = express.Router();

router.post("/create-product", verifyToken, createProduct);
router.get("/get-product", verifyToken, getProduct);
router.get("/get-product-restaurant", verifyToken, getProductRestaurant);
router.patch("/update-product", verifyToken, updateProduct);

export default router;
