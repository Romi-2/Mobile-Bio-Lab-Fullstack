// backend/routes/authRoute.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../server.js"; // shared MySQL connection

const router = express.Router();

// --- Helper: Generate JWT ---
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );
};

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, city } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = "INSERT INTO users (first_name, last_name, email, password, role, city) VALUES (?,?,?,?,?,?)";
      db.query(sql, [firstName, lastName, email, hashedPassword, role, city], (err2) => {
        if (err2) return res.status(500).json({ error: "Insert failed" });

        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT id, first_name AS firstName, last_name AS lastName, email, role, city, password FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(400).json({ message: "User not found" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });

      const token = generateToken(user.id, user.role);

      res.json({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        city: user.city,
        token,
      });
    }
  );
});

export default router;
