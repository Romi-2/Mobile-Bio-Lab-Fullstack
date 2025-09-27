// routes/reservationRoutes.js
import express from "express";
import { db } from "../server.js";  // MySQL connection
import { authenticate } from "../middleware/auth.js"; // JWT middleware

const router = express.Router();

// Book a reservation
router.post("/", authenticate, (req, res) => {
  const { reservation_date, reservation_time, duration } = req.body;
  const userId = req.user.id;

  // Prevent double booking
  const checkQuery = `
    SELECT * FROM reservations 
    WHERE reservation_date = ? AND reservation_time = ? AND status = 'approved'
  `;
  db.query(checkQuery, [reservation_date, reservation_time], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) return res.status(400).json({ msg: "Slot already booked!" });

    const insertQuery = `
      INSERT INTO reservations (user_id, reservation_date, reservation_time, duration) 
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertQuery, [userId, reservation_date, reservation_time, duration], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ msg: "Reservation request submitted!", id: result.insertId });
    });
  });
});

// Get user reservations
router.get("/my", authenticate, (req, res) => {
  db.query("SELECT * FROM reservations WHERE user_id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

export default router;
