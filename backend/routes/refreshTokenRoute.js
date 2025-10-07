// backend/routes/refreshRoute.js
import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../models/Database.js";

const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// ✅ POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    // 🔍 Check token in DB
    const [results] = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = ? AND expiry > NOW()",
      [refreshToken]
    );

    if (results.length === 0) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // ✅ Verify JWT signature
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      // 🔍 Fetch user info for role inclusion
      const [userRows] = await db.query(
        "SELECT id, role FROM users WHERE id = ?",
        [decoded.id]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = userRows[0];
      const newAccessToken = generateAccessToken(user);

      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("❌ Refresh token error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
