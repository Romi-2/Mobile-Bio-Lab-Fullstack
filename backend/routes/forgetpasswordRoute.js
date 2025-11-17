import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../models/Database.js";
import nodemailer from "nodemailer";

const router = express.Router();

// ------------------ FORGOT PASSWORD ------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 hour

    // Save token and expiry to DB
    await db.query(
      "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?",
      [token, expiry, user.id]
    );

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"PKLancer Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>🔒 Password Reset Request</h2>
        <p>Hello ${user.first_name},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" style="padding:10px 15px; background:#007bff; color:#fff; text-decoration:none;">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("Token saved for user:", token); // <-- log for debug
    res.json({ success: true, message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// ------------------ RESET PASSWORD ------------------
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ error: "Password is required" });

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?",
      [token, Date.now()]
    );

    if (results.length === 0)
      return res.status(400).json({ error: "Invalid or expired token" });

    const userId = results[0].id;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?",
      [hashedPassword, userId]
    );

    res.json({ success: true, message: "Password reset successfully! You can now log in." });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

export default router;
