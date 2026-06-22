import express from "express";
import { verifyToken } from "../../middlewares/tokens.js";
import {
  createCart,
  updateCart,
  deleteCart,
  getCart,
} from "./cart.controller.js";

const router = express.Router();

router.post("/create-cart", verifyToken, createCart);
router.patch("/update-cart", verifyToken, updateCart);
router.delete("/delete-cart", verifyToken, deleteCart);
router.get("/get-cart", verifyToken, getCart);

export default router;
