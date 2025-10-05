// backend/routes/reservationRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

/* ==========================================================
   ✅ 1. Fetch Available Slots (Filtered by City if Provided)
   ========================================================== */
router.get("/available", async (req, res) => {
  const { city } = req.query; // 👈 Get city from query string (e.g. /available?city=Lahore)

  // Base query
  let query = `
    SELECT 
      id,
      city,
      DATE_FORMAT(date, '%Y-%m-%d') AS date,
      TIME_FORMAT(start_time, '%H:%i') AS start_time,
      TIME_FORMAT(end_time, '%H:%i') AS end_time,
      available_seats
    FROM available_slots
    WHERE available_seats > 0
  `;

  const params = [];

  // If city is provided, filter by it
  if (city) {
    query += " AND city = ?";
    params.push(city);
  }

  query += " ORDER BY date, start_time";

  try {
    const [results] = await db.query(query, params);
    console.log(`✅ Reservation slots fetched for ${city || "all cities"}:`, results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching available slots:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Reserve a slot
router.post("/reserve", async (req, res) => {
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

    // Check if slot exists
    const [slot] = await db.query("SELECT * FROM available_slots WHERE id = ?", [slot_id]);
    if (!slot.length) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // Insert reservation
    const query = `
      INSERT INTO reservations (
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
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      user_id,
      slot_id,
      reservation_date,
      reservation_time,
      duration || "30 mins",
      status || "pending",
      sample_id || null,
      sample_type || null,
      collection_date || null,
      collection_time || null,
      geo_location || null,
      temperature || null,
      pH || null,
      salinity || null,
    ];

    await db.query(query, values);
    res.status(200).json({ message: "Reservation created successfully ✅" });
  } catch (error) {
    console.error("Reservation failed:", error);
    res.status(500).json({ error: "Server error while creating reservation" });
  }
});

export default router;
