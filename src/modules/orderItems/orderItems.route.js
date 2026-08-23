import express from "express";
import { verifyToken } from "../../middlewares/tokens.js";
import {
  addItem,
  updateItem,
  deleteItem,
  getByOrder,
} from "./orderItems.controller.js";

const router = express.Router();

router.post("/create-item", verifyToken, addItem);
router.patch("/update-item", verifyToken, updateItem);
router.delete("/delete-item", verifyToken, deleteItem);
router.get("/get-by-order", verifyToken, getByOrder);

export default router;
