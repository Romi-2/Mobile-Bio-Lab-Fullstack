// backend/routes/profileRoute.js
import express from "express";
import { db } from "../server.js"; // make sure db is exported in server.js
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router(); // ← initialize router

// GET currently logged-in user
router.get("/me", protect, (req, res) => {
  const userId = req.user.id; // set in protect middleware
  db.query(
    `SELECT 
      id, 
      first_name AS firstName, 
      last_name AS lastName, 
      vu_id AS vuId,
      mobile AS mobileNumber, 
      email, 
      role, 
      city, 
      profilePicture, 
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

export default router; // ← default export
