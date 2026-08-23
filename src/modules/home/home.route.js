import express from "express";
import {
  getHome,
  getHomeRestaurants,
  getHomeProducts,
} from "./home.controller.js";

const router = express.Router();

router.get("/", getHome);
router.get("/restaurants", getHomeRestaurants);
router.get("/products", getHomeProducts);

export default router;
