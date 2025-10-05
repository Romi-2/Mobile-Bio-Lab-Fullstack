// backend/routes/slotRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// ✅ Fetch all available slots grouped by city (for SlotReservationPage)
router.get("/available", async (req, res) => {
  const query = `
    SELECT 
      id, 
      city, 
      DATE_FORMAT(date, '%Y-%m-%d') AS date,
      TIME_FORMAT(start_time, '%H:%i') AS start_time,
      TIME_FORMAT(end_time, '%H:%i') AS end_time,
      available_seats
    FROM available_slots
    WHERE available_seats > 0
    ORDER BY city, date, start_time
  `;

  try {
    const [results] = await db.query(query);
    console.log("✅ Available slots fetched:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching slots:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
