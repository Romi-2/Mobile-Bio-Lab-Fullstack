// backend/routes/reservationRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// ✅ TEST ROUTE (to confirm file loads)
router.get("/test", (req, res) => {
  res.send("✅ reservationRoute is connected properly");
});

// ✅ GET available slots
router.get("/available", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, DATE AS date, start_time, end_time, available_seats
       FROM available_slots
       WHERE available_seats > 0
       ORDER BY DATE, start_time`
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

// ✅ POST to create reservation
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      slot_id,
      reservation_date,
      reservation_time,
      duration,
      status,
      sample_id,
      sample_type,
      collection_date,
      collection_time,
      geo_location,
      temperature,
      pH,
      salinity,
    } = req.body;

    if (!user_id || !slot_id || !reservation_date || !reservation_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert reservation
    const [result] = await db.query(
      `INSERT INTO reservations 
       (user_id, slot_id, reservation_date, reservation_time, duration, status,
        sample_id, sample_type, collection_date, collection_time, geo_location, temperature, pH, salinity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        slot_id,
        reservation_date,
        reservation_time,
        duration,
        status,
        sample_id,
        sample_type,
        collection_date,
        collection_time,
        geo_location,
        temperature,
        pH,
        salinity,
      ]
    );

    // Decrement available seats for the slot
    await db.query(
      "UPDATE available_slots SET available_seats = available_seats - 1 WHERE id = ? AND available_seats > 0",
      [slot_id]
    );

    res.json({
      message: "✅ Reservation created successfully",
      reservationId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error creating reservation:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

export default router;
