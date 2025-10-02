// backend/routes/slotRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// GET available slots grouped by city with seats info
router.get("/available", (req, res) => {
  const query = `
    SELECT city,
           DATE,
           start_time,
           end_time,
           available_seats
    FROM available_slots
    WHERE available_seats > 0
    ORDER BY city, DATE, start_time
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST reserve slot
router.post("/reserve", (req, res) => {
  const { slot_id, user_id } = req.body;

  db.query(
    "SELECT available_seats FROM available_slots WHERE id=?",
    [slot_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: "Slot not found" });
      if (results[0].available_seats <= 0) return res.status(400).json({ error: "No seats available" });

      // Decrease seat
      db.query(
        "UPDATE available_slots SET available_seats = available_seats - 1 WHERE id=?",
        [slot_id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Slot reserved successfully" });
        }
      );
    }
  );
});

export default router;
