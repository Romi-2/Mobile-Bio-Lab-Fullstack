// backend/routes/updateProfileRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import { db } from "../server.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "uploads/profilePics";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

// UPDATE user profile (Admin only)

// GET all users for admin
router.get("/all", protect, adminOnly, (req, res) => {
  const query = `
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
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("profilePicture"),
  (req, res) => {
    const userId = req.params.id;
    const vuEmail = req.body.vuEmail || req.body.vuEmailAddress;
    const { city } = req.body;
    const profilePicturePath = req.file ? `/uploads/profilePics/${req.file.filename}` : null;

    const updates = [];
    const values = [];

    if (vuEmail) { updates.push("vu_email_address = ?"); values.push(vuEmail); }
    if (city) { updates.push("city = ?"); values.push(city); }
    if (profilePicturePath) { updates.push("profilePicture = ?"); values.push(profilePicturePath); }

    if (updates.length === 0) return res.status(400).json({ message: "No fields to update" });

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    values.push(userId);

    db.query(sql, values, (err) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "DB error", err });
      }

      // Return updated user
      db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "DB error", err });
        res.json(results[0]);
      });
    });
  }
);

export default router;
