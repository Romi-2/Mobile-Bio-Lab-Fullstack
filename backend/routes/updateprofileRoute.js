// backend/routes/updateprofileRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../models/Database.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Ensure upload directory exists
const uploadDir = "uploads/profilePics";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Multer setup for profile picture uploads
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
    const [results] = await db.query(`
      SELECT 
        id, 
        first_name AS firstName, 
        last_name AS lastName, 
        email, 
        city, 
        role, 
        status, 
        profilePicture 
      FROM users
      ORDER BY id DESC
    `);

    res.json(results);
  } catch (err) {
    console.error("❌ DB Error in /all route:", err.message);
    res.status(500).json({ error: "Database error while fetching users" });
  }
});

/* =======================================================
   ✅ UPDATE USER (Admin Only)
   ======================================================= */
router.put("/:id", protect, adminOnly, upload.single("profilePicture"), async (req, res) => {
  const userId = req.params.id;
  const { email, city, firstName, lastName, role, status } = req.body;
  const profilePicturePath = req.file ? `/uploads/profilePics/${req.file.filename}` : null;

  try {
    // ✅ Check for duplicate email
    if (email) {
      const [existing] = await db.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: "Email already in use by another account" });
      }
    }

    const updates = [];
    const values = [];

    if (firstName) {
      updates.push("first_name = ?");
      values.push(firstName);
    }
    if (lastName) {
      updates.push("last_name = ?");
      values.push(lastName);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (city) {
      updates.push("city = ?");
      values.push(city);
    }
    if (role) {
      updates.push("role = ?");
      values.push(role);
    }
    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (profilePicturePath) {
      updates.push("profilePicture = ?");
      values.push(profilePicturePath);
    }

    if (updates.length === 0)
      return res.status(400).json({ message: "No fields to update" });

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    values.push(userId);

    await db.query(sql, values);

    // ✅ Fetch and return updated record
    const [rows] = await db.query(
      `SELECT 
         id, 
         first_name AS firstName, 
         last_name AS lastName, 
         email, 
         city, 
         role, 
         status, 
         profilePicture 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    if (user.profilePicture && !user.profilePicture.startsWith("/uploads/")) {
      user.profilePicture = `/uploads/${user.profilePicture}`;
    }

    res.json({ message: "User updated successfully ✅", user });
  } catch (err) {
    console.error("❌ DB Error in PUT /:id:", err.message);
    res.status(500).json({ message: "Server error while updating user" });
  }
});

export default router;
