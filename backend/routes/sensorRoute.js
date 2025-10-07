// backend/routes/sensorRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

/* ==========================================================
   ✅ POST /api/sensor
   Save incoming sensor data (temperature, timestamp)
   ========================================================== */
router.post("/", async (req, res) => {
  try {
    const { temperature, timestamp } = req.body;

    // ✅ Basic validation
    if (temperature === undefined || temperature === null) {
      return res.status(400).json({ error: "Temperature value is required" });
    }

    // ✅ Use current time if timestamp not provided
    const recordedAt = timestamp ? new Date(timestamp) : new Date();

    // ✅ Insert into DB
    await db.query(
      "INSERT INTO sensor_data (temperature, timestamp) VALUES (?, ?)",
      [temperature, recordedAt]
    );

    res.status(201).json({
      message: "Sensor data saved successfully ✅",
      data: { temperature, timestamp: recordedAt },
    });
  } catch (error) {
    console.error("❌ Error saving sensor data:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
});

/* ==========================================================
   ✅ GET /api/sensor/latest
   Fetch latest temperature record
   ========================================================== */
router.get("/latest", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1"
    );
    if (!rows.length)
      return res.status(404).json({ message: "No sensor data found" });

    res.json({ latest: rows[0] });
  } catch (error) {
    console.error("❌ Error fetching latest data:", error);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

/* ==========================================================
   ✅ GET /api/sensor/history?limit=50
   Fetch recent sensor readings
   ========================================================== */
router.get("/history", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const [rows] = await db.query(
      "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT ?",
      [limit]
    );
    res.json({ count: rows.length, data: rows });
  } catch (error) {
    console.error("❌ Error fetching sensor history:", error);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

export default router;
