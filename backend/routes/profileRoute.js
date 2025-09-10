// backend/routes/profileRoute.js
import express from "express";
import { db } from "../server.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  const userId = req.user.id;

  db.query(
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
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      const user = results[0];

      // Ensure full path for frontend
      if (user.profilePicture && !user.profilePicture.startsWith("/uploads/")) {
        user.profilePicture = `/uploads/${user.profilePicture}`;
      }

      res.json(user);
    }
  );
});

export default router;
