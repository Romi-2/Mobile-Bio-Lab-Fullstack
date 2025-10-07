// backend/routes/profileRoute.js
import express from "express";
import { db } from "../models/Database.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Promise-based query
    const [results] = await db.query(
      `SELECT 
        id, 
        first_name AS firstName, 
        last_name AS lastName, 
        vu_id AS vu_id,
        mobile, 
        email, 
        role, 
        city, 
        profilePicture,
        status
      FROM users
      WHERE id = ?`,
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // Ensure full path for frontend display
    if (user.profilePicture && !user.profilePicture.startsWith("/uploads/")) {
      user.profilePicture = `/uploads/${user.profilePicture}`;
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching profile:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

export default router;
