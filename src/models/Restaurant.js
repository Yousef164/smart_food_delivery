import pkg from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";


const { DataTypes } = pkg;

const SALT_ROUNDS = 10;

const Restaurant = sequelize.define(
  "Restaurant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurantName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    businessEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailToken: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    verifyEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (restaurant) => {
        if (restaurant.password) {
          restaurant.password = await bcrypt.hash(
            restaurant.password,
            SALT_ROUNDS,
          );
        }
      },
      beforeUpdate: async (restaurant) => {
        if (restaurant.changed("password")) {
          restaurant.password = await bcrypt.hash(
            restaurant.password,
            SALT_ROUNDS,
          );
        }
      },
    },
  },
);

export default Restaurant;