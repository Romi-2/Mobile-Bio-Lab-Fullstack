// backend/routes/authRoute.js
import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../models/Database.js";

const router = express.Router();

// ✅ Activation + auto-login endpoint
router.get("/activate/:activationToken", async (req, res) => {
  const { activationToken } = req.params;

  if (!activationToken) {
    return res.status(400).json({ message: "Activation token is required" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      activationToken,
      process.env.JWT_SECRET || "secretkey"
    );

    // Activate user
    const [updateResult] = await db.query(
      "UPDATE users SET isActivated = 'Active', activationToken = NULL WHERE id = ?",
      [decoded.id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(401).json({ message: "Invalid or expired activation token" });
    }

    // Fetch updated user
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    const user = users[0];

    // Generate JWT tokens for auto-login
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    // Optionally store refreshToken in DB
    await db.query(
      `INSERT INTO refresh_tokens (userId, token, expiry)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [user.id, refreshToken]
    );

    // Redirect to frontend with tokens as query params
    const frontendUrl = `http://localhost:5173/login?token=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(frontendUrl);
  } catch (err) {
    console.error("❌ Activation error:", err.message);
    return res.status(401).json({ message: "Invalid or expired activation token" });
  }
});

export default router;
