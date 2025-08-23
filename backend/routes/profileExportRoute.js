// backend/routes/profileExportRoute.js
import express from "express";
import { db } from "../server.js";              // Import MySQL connection
import { generateUserProfilePDF } from "../utils/pdfHelper.js";

const router = express.Router();

// ✅ Export user profile to PDF by ID
router.get("/profile/:id", (req, res) => {
  const userId = req.params.id;

  const query = `
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
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user:", err);
      return res.status(500).json({ message: "DB Error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    generateUserProfilePDF(user, res);  // Generate and send PDF
  });
});

export default router;
