import express from "express";
import { db } from "../server.js";

const router = express.Router();

// Create reservation
router.post("/", async (req, res) => {
  const user_id = Number(req.body.user_id);
  const slot_id = Number(req.body.slot_id);

  if (!user_id || !slot_id) {
    return res.status(400).json({ msg: "user_id and slot_id are required" });
  }

  try {
    // Check if slot is available
    const [slotCheckRows] = await db.query(
      "SELECT id FROM available_slots WHERE id = ? AND isBooked = 0",
      [slot_id]
    );

    if (Array.isArray(slotCheckRows) && slotCheckRows.length === 0) {
      return res.status(400).json({ msg: "Slot already booked or invalid" });
    }

    // Insert reservation
    const [result] = await db.query(
      "INSERT INTO reservations (user_id, slot_id, status) VALUES (?, ?, 'pending')",
      [user_id, slot_id]
    );

    // Mark slot as booked
    await db.query("UPDATE available_slots SET isBooked = 1 WHERE id = ?", [slot_id]);

    return res.json({ id: result.insertId, msg: "Reservation created" });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

export default router;
