require("dotenv").config();

const required = ["MONGODB_URI"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing environment variable(s): ${missing.join(", ")}`);
  process.exit(1);
}

module.exports = {
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB || "campus-flow",
  isProduction: process.env.NODE_ENV === "production",
  
  corsOrigins: (process.env.CORS_ORIGINS ||
    "http://localhost:3000,https://campus-flow-theta-bay.vercel.app")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
