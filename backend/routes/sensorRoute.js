import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// ✅ Save incoming sensor data
router.post("/", async (req, res) => {
  const { temperature, timestamp } = req.body;

  try {
    await db.query(
      "INSERT INTO sensor_data (temperature, timestamp) VALUES (?, ?)",
      [temperature, timestamp]
    );
    res.json({ message: "Sensor data saved successfully ✅" });
  } catch (error) {
    console.error("❌ DB insert failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
