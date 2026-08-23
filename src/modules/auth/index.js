import express from "express";
import userRoutes from "../users/authUsers.routes.js";
import restaurantRoutes from "../restaurants/restaurant.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/restaurants", restaurantRoutes);

export default router;
