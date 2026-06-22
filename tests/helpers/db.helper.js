import sequelize from "../../src/config/database.js";
import {
  User,
  Restaurant,
  Product,
  BranchAddress,
  Address,
} from "../../src/models/index.js";

export const initTestDatabase = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
};

export const resetTestDatabase = async () => {
  await BranchAddress.destroy({ where: {} });
  await Address.destroy({ where: {} });
  await Product.destroy({ where: {} });
  await Restaurant.destroy({ where: {} });
  await User.destroy({ where: {} });
};

export const closeTestDatabase = async () => {
  await sequelize.close();
};
