// backend/routes/reservationRoute.js
import express from "express";
import { db } from "../server.js";

const router = express.Router();

// Create Reservation
router.post("/create", async (req, res) => {
  const { userId, date, time, guests } = req.body;

  try {
    // Insert new reservation
    const [result] = await db.query(
      "INSERT INTO reservations (user_id, date, time, guests, status) VALUES (?, ?, ?, ?, ?)",
      [userId, date, time, guests, "pending"]
    );

    const reservationId = result.insertId;

    // ✅ Update the reservation after creating (example: confirm automatically)
    await db.query(
      "UPDATE reservations SET status = ? WHERE id = ?",
      ["confirmed", reservationId]
    );

    res.status(201).json({
      message: "Reservation created and updated successfully",
      reservationId,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
