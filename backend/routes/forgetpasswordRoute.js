import express from "express";
import crypto from "crypto";
import { db } from "../server.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  // 1. Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];

    // 2. Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 hour

    // 3. Save token & expiry in DB
    db.query(
      "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?",
      [token, expiry, user.id],
      (err2) => {
        if (err2) {
          console.error("DB Error:", err2);
          return res.status(500).json({ error: "Database error" });
        }
      }
    );

    // 4. Send email
    const resetLink = `http://localhost:5173/reset-password/${token}`; // frontend URL

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        text: `Click here to reset your password: ${resetLink}`,
      });

      res.json({ message: "Password reset link sent to your email." });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
      res.status(500).json({ error: "Failed to send email" });
    }
  });
});

export default router;
