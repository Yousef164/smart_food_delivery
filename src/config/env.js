import dotenv from "dotenv";
const envPath = process.env.NODE_ENV === "test" ? ".env.test" : undefined;
dotenv.config({ path: envPath });

// Server Configuration
export const port = process.env.PORT || 3000;
export const nodeEnv = process.env.NODE_ENV || "development";

// Database Configuration
export const dbDialect =
  process.env.DB_DIALECT || (nodeEnv === "test" ? "sqlite" : "postgres");
export const dbStorage = process.env.DB_STORAGE || ":memory:";
export const dbName = process.env.DB_NAME;
export const dbUser = process.env.DB_USER;
export const dbPassword = process.env.DB_PASSWORD;
export const dbHost = process.env.DB_HOST;
export const dbPort = process.env.DB_PORT;

// JWT Configuration
export const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

//App
export const urlApp = process.env.URL_APP;
export const emailApp = process.env.EMAIL_APP;
export const passwordApp = process.env.PASSWORD_APP;

// Paymob Configuration
export const paymobApiKey = process.env.PAYMOB_API_KEY;
export const paymobIframeId = process.env.PAYMOB_IFRAME_ID;
export const paymobIntegrationIdCard =
  process.env.PAYMOB_INTGRATION_ID_CARD;
export const paymobIntegrationIdWallet =
  process.env.PAYMOB_INTGRATION_ID_WALLET;
export const paymobHmacSecret =
  process.env.PAYMOB_HAMC_SECRET;

//Google Auth
export const clientId = process.env.Client_ID || "test-client-id";
export const clientSecret = process.env.Client_secret || "test-client-secret";
export const callbackURL =
  process.env.callbackURL || "http://localhost:3000/auth/users/google/callback";
