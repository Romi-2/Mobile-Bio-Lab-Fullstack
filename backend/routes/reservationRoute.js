// backend/routes/reservationRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// Create reservation with sample details
router.post("/", async (req, res) => {
  try {
    const { user_id, slot_id, reservation_date, reservation_time, duration, status, sample } = req.body;

    // Example insert
    const [result] = await db.query(
      "INSERT INTO reservations (user_id, slot_id, reservation_date, reservation_time, duration, status) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, slot_id, reservation_date, reservation_time, duration, status]
    );

    const reservationId = result.insertId;

    // Insert into samples
    if (sample) {
      await db.query(
        "INSERT INTO samples (reservation_id, sample_id, sample_type, collection_date, collection_time, geo_location, temperature, pH, salinity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          reservationId,
          sample.sample_id,
          sample.sample_type,
          sample.collection_date,
          sample.collection_time,
          sample.geo_location,
          sample.temperature,
          sample.pH,
          sample.salinity,
        ]
      );
    }

    res.json({ message: "Reservation created successfully", reservationId });
  } catch (error) {
    console.error("❌ Error creating reservation:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});


export default router;
