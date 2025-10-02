// backend/routes/registerRoute.js
import express from "express";
import multer from "multer";
import { db } from "../models/Database.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ensure folder exists
const uploadDir = "uploads/profilePics";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage with safe filenames
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

router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    const { firstName, lastName, vuId, email, password, mobile, city, role } = req.body;
    const profilePicture = req.file ? `/uploads/profilePics/${req.file.filename}` : null;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users
      (first_name, last_name, vu_id, email, password, mobile, role, city, profilePicture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [firstName, lastName, vuId, email, hashedPassword, mobile, role, city, profilePicture],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId,
          profilePicture,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
