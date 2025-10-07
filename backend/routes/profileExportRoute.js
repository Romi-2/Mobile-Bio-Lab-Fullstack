// backend/routes/profileExportRoute.js
import express from "express";
import { db } from "../models/Database.js"; // ✅ Promise-based MySQL pool
import { generateUserProfilePDF } from "../utils/pdfHelper.js";

const router = express.Router();

// ✅ Export user profile to PDF by ID
router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [results] = await db.query(
      `
      SELECT 
        id, 
        first_name AS firstName, 
        last_name AS lastName, 
        email, 
        role, 
        city, 
        vu_id AS studentId 
      FROM users 
      WHERE id = ?
      `,
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    generateUserProfilePDF(user, res); // ✅ Generate and send PDF
  } catch (err) {
    console.error("❌ Error fetching user:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

export default router;
