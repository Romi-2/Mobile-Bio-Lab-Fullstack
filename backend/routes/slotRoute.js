// backend/routes/slotRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

/* ==========================================================
   ✅ GET /api/slots/available
   Fetch all available slots (optionally filtered by city)
   ========================================================== */
router.get("/available", async (req, res) => {
  try {
    const { city } = req.query; // e.g. /available?city=Lahore

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

    // ✅ Optional filtering by city
    if (city) {
      query += " AND city = ?";
      params.push(city);
    }

    query += " ORDER BY city, date, start_time";

    const [results] = await db.query(query, params);

    if (!results.length) {
      console.warn(`⚠️ No available slots found for ${city || "any city"}`);
      return res.status(404).json({ message: "No available slots found" });
    }

    console.log(`✅ ${results.length} slots fetched for ${city || "all cities"}`);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching available slots:", err.message);
    res.status(500).json({ error: "Database error while fetching slots" });
  }
});

/* ==========================================================
   ✅ GET /api/slots/:id
   Fetch a single slot by ID
   ========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT 
         id,
         city,
         DATE_FORMAT(date, '%Y-%m-%d') AS date,
         TIME_FORMAT(start_time, '%H:%i') AS start_time,
         TIME_FORMAT(end_time, '%H:%i') AS end_time,
         available_seats
       FROM available_slots
       WHERE id = ?`,
      [id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Slot not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching slot by ID:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
