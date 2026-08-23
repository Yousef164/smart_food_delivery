import express from "express";
import cors from "cors";

import sequelize from "./config/database.js";
import authRoutes from "./modules/auth/index.js";
import products from "./modules/products/products.route.js";
import branches from "./modules/branchesAddresses/branches.route.js";
import addresses from "./modules/Addresses/addresses.route.js";
import orders from "./modules/orders/orders.route.js";
import cartRoutes from "./modules/cart/cart.route.js";
import orderItems from "./modules/orderItems/orderItems.route.js";
import homeRoutes from "./modules/home/home.route.js";
import {
  errorHandler,
  ApiError,
  asyncHandler,
} from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/product", products);
app.use("/branch", branches);
app.use("/address", addresses);
app.use("/cart", cartRoutes);
app.use("/order-items", orderItems);
app.use("/api/orders", orders);

app.get(
  "/api/health",
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Server is running",
    });
  }),
);

app.use((req, res, next) => {
  next(new ApiError("Route not found", 404));
});

app.use(errorHandler);

export default app;
