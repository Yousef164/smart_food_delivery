import User from "./User.js";
import Restaurant from "./Restaurant.js";
import Product from "./Product.js";
import Cart from "./Cart.js";
import BranchAddress from "./BranchAddress.js";
import Address from "./Address.js";
import Order from "./Order.js";
import OrderItem from "./orderItems.js";

Restaurant.hasMany(Product, {
  foreignKey: "restaurantId",
  as: "products",
});
Product.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
  as: "restaurant",
});

Restaurant.hasMany(BranchAddress, {
  foreignKey: "restaurantId",
  as: "branchAddresses",
});
BranchAddress.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
  as: "restaurant",
});

User.hasMany(Address, {
  foreignKey: "userId",
  as: "address",
});
Address.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Order, {
  foreignKey: "userId",
  as: "order",
});
Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
Order.hasOne(Address, {
  foreignKey: "addressId",
  as: "address",
});
Address.belongsTo(Order, {
  foreignKey: "addressId",
  as: "order",
});

User.hasMany(Cart, {
  foreignKey: "userId",
  as: "cartItems",
});
Cart.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Product.hasMany(Cart, {
  foreignKey: "productId",
  as: "cartItems",
});
Cart.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
});
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems",
});
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

export { User, Restaurant, Product, BranchAddress, Address, Order, Cart };
