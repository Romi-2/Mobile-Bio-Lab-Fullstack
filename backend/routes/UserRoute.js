// backend/routes/userRoutes.js
import express from "express";
import { db } from "../server.js"; // import the DB connection

const router = express.Router();

// ✅ Get all users
router.get("/", (req, res) => {
  const query = `
    SELECT 
      id, 
      first_name AS firstName, 
      last_name AS lastName, 
      email, 
      role, 
      city 
    FROM users
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ message: "DB Error", error: err });
    }
    res.json({ users: results });
  });
});

// ✅ Get a single user by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      id, 
      first_name AS firstName, 
      last_name AS lastName, 
      email, 
      role, 
      city 
    FROM users 
    WHERE id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user:", err);
      return res.status(500).json({ message: "DB Error", error: err });
    }
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ user: results[0] });
  });
});
// Activate user account
router.get("/activate/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const token = req.query.token;

  try {
    const query = "SELECT * FROM users WHERE vu_id = ? AND activationToken = ? AND isActivated = false";
    db.query(query, [studentId, token], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });
      if (results.length === 0) return res.json({ success: false, message: "Invalid or expired link" });

      const updateQuery = "UPDATE users SET isActivated = true, activationToken = NULL WHERE vu_id = ?";
      db.query(updateQuery, [studentId], (err2) => {
        if (err2) return res.status(500).json({ success: false, message: "Server error" });
        res.json({ success: true, message: "Your account has been activated!" });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;
