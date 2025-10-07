// backend/routes/loginRoute.js
import express from "express";
import bcrypt from "bcryptjs"; // ✅ use bcryptjs (same as register route)
import jwt from "jsonwebtoken";
import { db } from "../models/Database.js";

const router = express.Router();

// --- Helper: Generate Tokens ---
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "15m" } // short expiry for security
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" } // longer expiry for refresh token
  );
};

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    // ✅ Fetch user from DB
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = results[0];

    // ✅ Check if account is pending or inactive
    if (user.status === "pending")
      return res.status(403).json({ message: "Your account is still pending approval." });

    if (user.isActivated === "Inactive")
      return res.status(403).json({ message: "Please activate your account via email link." });

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // ✅ Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ✅ Store refresh token in DB
    await db.query(
      `INSERT INTO refresh_tokens (userId, token, expiry) 
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [user.id, refreshToken]
    );

    // ✅ Respond with clean, safe user info
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        city: user.city,
        isActivated: user.isActivated,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
