// backend/server.js
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Routes
import authRoute from "./routes/authRoute.js"; 
import refreshTokenRoute from "./routes/refreshTokenRoute.js"; 
import adminRoute from "./routes/adminroutes.js"; 
import userRoute from "./routes/UserRoute.js";   
import registerRoute from "./routes/registerRoute.js";
import profileRoute from "./routes/profileRoute.js";
import profileExportRoute from "./routes/profileExportRoute.js";
import updateProfileRoute from "./routes/updateprofileRoute.js";
import forgotPasswordRoute from "./routes/forgetpasswordRoute.js";
import adminReportRoute from "./routes/adminReportRoute.js";
import reservationRoute from "./routes/reservationRoute.js";
import reservationPendingRoute from "./routes/reservationPendingRoute.js";
import slotRoute from "./routes/slotRoute.js";
import sampleRoute from "./routes/sampleRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// MySQL connection using promise wrapper
export const db = await mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "mobile_bio_lab",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  const [rows] = await db.query("SELECT 1"); // simple test query
  console.log("✅ Connected to MySQL database");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
}

// ------------------------
// Routes
app.use("/api/auth/register", registerRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/token", refreshTokenRoute);
app.use("/api/export", profileExportRoute);
app.use("/api/admin/update-profile", updateProfileRoute);
app.use("/api/auth", forgotPasswordRoute);
app.use("/api/admin", adminReportRoute);
app.use("/api/reservations", reservationRoute);
app.use("/api/reservation-pending", reservationPendingRoute);
app.use("/api/slots", slotRoute);
app.use("/api/samples", sampleRoute);

// Test route
app.get("/", (req, res) => res.send("🚀 API is running..."));

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

export default app;
