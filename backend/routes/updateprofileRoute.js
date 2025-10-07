// backend/routes/updateprofileRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import { db } from "../models/Database.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import fs from "fs";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads/profilePics";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[()]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

const upload = multer({ storage });

/* =======================================================
   ✅ GET ALL USERS (Admin Only)
   ======================================================= */
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT id, first_name AS firstName, last_name AS lastName, email, city, role, status, profilePicture 
       FROM users`
    );
    res.json(results);
  } catch (err) {
    console.error("❌ DB Error in /all route:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/* =======================================================
   ✅ UPDATE USER (Admin Only)
   ======================================================= */
router.put("/:id", protect, adminOnly, upload.single("profilePicture"), async (req, res) => {
  const userId = req.params.id;
  const { email, city } = req.body; // changed 'vuEmail' → 'email' to match frontend
  const profilePicturePath = req.file ? `/uploads/profilePics/${req.file.filename}` : null;

  try {
    const updates = [];
    const values = [];

    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (city) {
      updates.push("city = ?");
      values.push(city);
    }
    if (profilePicturePath) {
      updates.push("profilePicture = ?");
      values.push(profilePicturePath);
    }

    if (updates.length === 0)
      return res.status(400).json({ message: "No fields to update" });

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    values.push(userId);

    // Execute update query
    await db.query(sql, values);

    // Fetch updated user record
    const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    const user = rows[0];

    // Normalize profile picture path
    if (user?.profilePicture && !user.profilePicture.startsWith("/uploads/")) {
      user.profilePicture = `/uploads/${user.profilePicture}`;
    }

    res.json(user);
  } catch (err) {
    console.error("❌ DB Error in /:id route:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
