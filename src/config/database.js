import pkg from "sequelize";
const { Sequelize } = pkg;
import {
  dbName,
  dbUser,
  dbPassword,
  dbHost,
  dbPort,
  dbDialect,
  dbStorage,
} from "./env.js";
import { ApiError } from "../middlewares/errorHandler.js";

const sequelizeOptions = {
  dialect: dbDialect,
  logging: false,
};

if (dbDialect === "sqlite") {
  sequelizeOptions.storage = dbStorage;
} else {
  sequelizeOptions.host = dbHost;
  sequelizeOptions.port = dbPort;
}

const sequelize = new Sequelize(
  dbDialect === "sqlite" ? undefined : dbName,
  dbDialect === "sqlite" ? undefined : dbUser,
  dbDialect === "sqlite" ? undefined : dbPassword,
  sequelizeOptions,
);

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    await sequelize.sync({ alter: false });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw new ApiError("Failed to initialize database", 500);
  }
};

export default sequelize;
