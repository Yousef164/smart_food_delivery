import express from "express";
import { verifyToken } from "../../middlewares/tokens.js";

import {
  signup,
  login,
  verifyEmail,
  getRestaurantProfile,
  updateRestaurantProfile,
  getAllRestaurants,
  searchRestaurant,
} from "./restaurant.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.get("/profile", verifyToken, getRestaurantProfile);
router.get("/get-all-restaurants", verifyToken, getAllRestaurants);
router.get("/searchRestaurant", verifyToken, searchRestaurant);
router.patch("/profile", verifyToken, updateRestaurantProfile);

export default router;
