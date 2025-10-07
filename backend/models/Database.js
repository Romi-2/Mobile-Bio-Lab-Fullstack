// backend/models/Database.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a connection pool
export const db = await mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME, // ✅ now it reads from .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional test connection
try {
  const [rows] = await db.query("SELECT 1 + 1 AS result");
  console.log("✅ Database pool connected successfully");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}
