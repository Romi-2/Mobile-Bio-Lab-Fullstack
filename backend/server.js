import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";
import dotenv from "dotenv";
import registerRoute from "./routes/registerRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder for profile pics
app.use("/uploads", express.static("uploads"));

// MySQL connection
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err.message);
  else console.log("✅ Connected to MySQL database");
});

// Routes
app.use("/api/users", registerRoute);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
