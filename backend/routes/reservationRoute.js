import express from "express";
import { db } from "../models/Database.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ import protect

const router = express.Router();

// ✅ Create a Reservation (use logged-in user's ID)
router.post("/reserve", protect, async (req, res) => {
  try {
    // ✅ Get user ID from token (not from body)
    const user_id = req.user.id;

    const {
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

    // ✅ Check if slot exists
    const [slot] = await db.query("SELECT * FROM available_slots WHERE id = ?", [slot_id]);
    if (!slot.length) return res.status(404).json({ error: "Slot not found" });

    // ✅ Prevent overbooking
    if (slot[0].available_seats <= 0)
      return res.status(400).json({ error: "No available seats for this slot" });

    // ✅ Insert reservation (using actual user ID)
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
      user_id, // ✅ always correct user
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

    const [result] = await db.query(query, values);

    // ✅ Reduce available seats
    await db.query(
      "UPDATE available_slots SET available_seats = available_seats - 1 WHERE id = ? AND available_seats > 0",
      [slot_id]
    );

    res.status(201).json({
      message: "Reservation created successfully ✅",
      reservationId: result.insertId,
      slot_id,
      user_id, // optional for confirmation
    });
  } catch (error) {
    console.error("❌ Reservation failed:", error);
    res.status(500).json({ error: "Server error while creating reservation" });
  }
});

export default router;
