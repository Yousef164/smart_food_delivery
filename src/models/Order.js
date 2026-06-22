import pkg from "sequelize";

import sequelize from "../config/database.js";

const { DataTypes } = pkg;

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  addressId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Addresses",
      key: "id",
    },
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM("cash", "wallet", "card"),
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    allowNull: false,ج
  },
  paymobOrderId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  paymobTransactionId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

export default Order;
