import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Routes
import authRoute from "./routes/authRoute.js"; // Registration & Login
import refreshTokenRoute from "./routes/refreshTokenRoute.js"; // Token refresh
import adminRoute from "./routes/adminroutes.js"; // Admin CRUD
import userRoute from "./routes/UserRoute.js";   // User CRUD
import registerRoute from "./routes/registerRoute.js";
import profileRoute from "./routes/profileRoute.js";
import profileExportRoute from "./routes/profileExportRoute.js";
import updateProfileRoute from "./routes/updateprofileRoute.js";
import forgotPasswordRoute from "./routes/forgetpasswordRoute.js";
import adminReportRoute from "./routes/adminReportRoute.js";



dotenv.config();

const app = express(); // ✅ declare app first
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// MySQL connection
export const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "mobile_bio_lab",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database");
});

// ------------------------
app.use("/api/auth/register", registerRoute); // Register
app.use("/api/auth", authRoute);             // Login & auth
app.use("/api/admin", adminRoute);           // Admin
app.use("/api/users", userRoute);            // User CRUD
app.use("/api/profile", profileRoute);       // ✅ corrected
app.use("/api/token", refreshTokenRoute);
app.use("/api/export", profileExportRoute);
app.use("/api/admin/update-profile", updateProfileRoute);
app.use("/api/auth", forgotPasswordRoute);
app.use("/api/admin", adminReportRoute);

// Test route
app.get("/", (req, res) => res.send("🚀 API is running..."));

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

export default app;
