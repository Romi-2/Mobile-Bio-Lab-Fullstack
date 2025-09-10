// backend/routes/updateProfileRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import { db } from "../server.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import fs from "fs";

const router = express.Router();
const uploadDir = "uploads/profilePics";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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

// Get all users (admin)
router.get("/all", protect, adminOnly, (req, res) => {
  db.query(
    `SELECT id, first_name AS firstName, last_name AS lastName, email, city, role, status, profilePicture FROM users`,
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

// Update user
router.put("/:id", protect, adminOnly, upload.single("profilePicture"), (req, res) => {
  const userId = req.params.id;
  const { vuEmail, city } = req.body;
  const profilePicturePath = req.file ? `/uploads/profilePics/${req.file.filename}` : null;

  const updates = [];
  const values = [];

  if (vuEmail) { updates.push("email = ?"); values.push(vuEmail); }
  if (city) { updates.push("city = ?"); values.push(city); }
  if (profilePicturePath) { updates.push("profilePicture = ?"); values.push(profilePicturePath); }

  if (updates.length === 0) return res.status(400).json({ message: "No fields to update" });

  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  values.push(userId);

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ message: "DB error", err });

    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) return res.status(500).json({ message: "DB error", err });

      const user = results[0];
      if (user.profilePicture && !user.profilePicture.startsWith("/uploads/")) {
        user.profilePicture = `/uploads/${user.profilePicture}`;
      }

      res.json(user);
    });
  });
});

export default router;
