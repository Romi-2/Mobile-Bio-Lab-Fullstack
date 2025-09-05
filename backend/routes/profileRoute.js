import express from "express";
import { db } from "../server.js";
import { protect } from "../middleware/authMiddleware.js"; // make sure protect middleware exists

const router = express.Router();

// Get current user's profile
router.get("/me", protect, (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT 
      id, 
      first_name AS firstName, 
      last_name AS lastName, 
      vu_id AS vu_id,
      mobile AS mobile, 
      email, 
      role, 
      city, 
      SUBSTRING_INDEX(profilePicture, '/', -1) AS profilePicture, 
      status
    FROM users
    WHERE id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(results[0]);
    }
  );
});

export default router; // ✅ default export
