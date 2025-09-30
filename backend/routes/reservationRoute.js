// backend/routes/reservationRoute.js
import express from "express";
import { db } from "../server.js";

const router = express.Router();

// Create reservation with slot_id
router.post("/", async (req, res) => {
  try {
    const { user_id, slot_id, duration } = req.body;

    const [[slot]] = await db.query(
      "SELECT * FROM available_slots WHERE id=? AND isBooked=0",
      [slot_id]
    );

    if (!slot) {
      return res.status(400).json({ msg: "Slot not available" });
    }

    const [result] = await db.query(
      `INSERT INTO reservations (user_id, slot_id, reservation_date, reservation_time, duration) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, slot_id, slot.date, slot.start_time, duration]
    );

    await db.query("UPDATE available_slots SET isBooked=1 WHERE id=?", [slot_id]);

    res.status(201).json({ msg: "Reservation created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating reservation" });
  }
});

export default router;
