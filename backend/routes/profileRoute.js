// backend/routes/profileRoute.js
import express from "express";
import { db } from "../server.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET currently logged-in user
router.get("/me", protect, (req, res) => {
  const userId = req.user.id; // set in protect middleware
  db.query(
  `SELECT 
    id, 
    first_name AS firstName, 
    last_name AS lastName, 
    student_vu_id AS studentVUId, 
    mobile_number AS mobileNumber, 
    vu_email_address AS vuEmailAddress, 
    profile_picture AS profilePicture,
    email, role, city, status
   FROM users 
   WHERE id = ?`,
  [userId],
  (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  }
);
});

export default router;
