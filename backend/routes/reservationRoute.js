// backend/routes/reservationRoute.js
import express from "express";
import { db } from "../server.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { user_id, reservation_date, reservation_time, duration, status } = req.body;

  // ✅ Validate required fields
  if (!user_id) {
    return res.status(400).json({ msg: "User ID is required" });
  }
  if (!reservation_date) {
    return res.status(400).json({ msg: "Reservation date is required" });
  }
  if (!reservation_time) {
    return res.status(400).json({ msg: "Reservation time is required" });
  }

  // ✅ Validate duration
  const durationValue = duration ? Number(duration) : 60;
  if (isNaN(durationValue) || durationValue <= 0) {
    return res.status(400).json({ msg: "Duration must be a valid positive number" });
  }

  // ✅ Step 1: Verify user exists in users table
  db.query("SELECT id FROM users WHERE id = ?", [user_id], (err, results) => {
    if (err) {
      console.error("❌ DB Error while checking user:", err.sqlMessage || err);
      return res.status(500).json({ msg: "Database error while checking user" });
    }

    if (results.length === 0) {
      return res.status(400).json({ msg: "Invalid user_id (user does not exist)" });
    }

    // ✅ Step 2: Insert reservation
    const sql = `
      INSERT INTO reservations 
      (user_id, reservation_date, reservation_time, duration, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(
      sql,
      [user_id, reservation_date, reservation_time, durationValue, status || "pending"],
      (err, result) => {
        if (err) {
          console.error("❌ DB Insert Error:", err.sqlMessage || err);
          return res.status(500).json({ msg: "Database error while booking slot" });
        }
        res.status(201).json({
          msg: "✅ Reservation created successfully",
          id: result.insertId,
        });
      }
    );
  });
});

export default router;
