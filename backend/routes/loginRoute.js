// backend/routes/loginRoute.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../models/Database.js"; // adjust if needed

const router = express.Router();

// 🧠 Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!users || users.length === 0)
      return res.status(404).json({ message: "User not found." });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password." });

    if (user.status === "pending")
      return res.status(403).json({ message: "Account pending approval." });

    if (user.status === "rejected")
      return res.status(403).json({ message: "Your account has been rejected." });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1d" }
    );

    // ✅ Update token in DB
    await db.query("UPDATE users SET token = ? WHERE id = ?", [token, user.id]);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
