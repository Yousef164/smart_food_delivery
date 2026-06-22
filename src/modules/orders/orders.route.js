import express from "express";

import { verifyToken } from "../../middlewares/tokens.js";
import { createOrder, confirmPayment } from "./orders.controller.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.post("/confirm-payment", confirmPayment);
router.delete("/cancel-order", verifyToken, deleteOrder)

export default router;
