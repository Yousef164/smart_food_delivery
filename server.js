import app from "./src/app.js";
import { initializeDatabase } from "./src/config/database.js";
import { port } from "./src/config/env.js";

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
