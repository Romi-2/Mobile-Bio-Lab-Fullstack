// backend/routes/slotRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// ✅ GET available slots grouped by city with seats info
router.get("/available", async (req, res) => {
  const query = `
  SELECT city,
         \`date\`,
         start_time,
         end_time,
         available_seats
  FROM available_slots
  WHERE available_seats > 0
  ORDER BY city, \`date\`, start_time
`;

  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching slots:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST reserve slot
router.post("/reserve", async (req, res) => {
  const { slot_id, user_id } = req.body;

  try {
    const [results] = await db.query(
      "SELECT available_seats FROM available_slots WHERE id=?",
      [slot_id]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Slot not found" });
    }
    if (results[0].available_seats <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    // Decrease seat
    await db.query(
      "UPDATE available_slots SET available_seats = available_seats - 1 WHERE id=?",
      [slot_id]
    );

    res.json({ message: "Slot reserved successfully" });
  } catch (err) {
    console.error("❌ Error reserving slot:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
