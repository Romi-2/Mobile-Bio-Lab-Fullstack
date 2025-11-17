// routes/registerRoute.js
import express from "express";
import multer from "multer";
import { db } from "../models/Database.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const router = express.Router();

// ------------------------
// Ensure uploads folder exists
const uploadDir = "uploads/profilePics";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ------------------------
// Multer storage configuration
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

// ------------------------
// JWT helper
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined in .env");
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ------------------------
// Registration route
router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    const { firstName, lastName, vuId, email, password, mobile, city, role } = req.body;
    const profilePicture = req.file ? `/uploads/profilePics/${req.file.filename}` : null;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role || !vuId || !mobile || !city || !profilePicture) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const query = `
      INSERT INTO users 
        (first_name, last_name, vu_id, email, password, mobile, role, city, profilePicture, status, isActivated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      firstName,
      lastName,
      vuId,
      email,
      hashedPassword,
      mobile,
      role,
      city,
      profilePicture,
      "pending",
      "Inactive",
    ]);

    // Generate JWT token
    const token = generateToken(result.insertId, role);

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.insertId,
        firstName,
        lastName,
        vuId,
        email,
        mobile,
        role,
        city,
        profilePicture,
        status: "pending",
        isActivated: "Inactive",
      },
    });

  } catch (err) {
    console.error("Register Error:", err);

    // Check for database errors
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

export default router;
