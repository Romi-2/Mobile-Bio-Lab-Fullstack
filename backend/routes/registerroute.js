// registerroute.js
import express from "express";
import multer from "multer";
import { db } from "../server.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Single POST route
router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    const { firstName, lastName, vuId, email, password, mobile, city, role } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ error: "⚠️ Please fill all required fields" });

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
        if (err) {
  console.error("❌ DB Error:", err);
  return res.status(500).json({ error: "Database error", details: err.message });
}
        res.status(201).json({ message: "✅ User registered successfully", userId: result.insertId, profilePicture });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
