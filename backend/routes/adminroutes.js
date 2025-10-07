// backend/routes/adminroutes.js
import express from "express";
import { db } from "../models/Database.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import transporter from "../emailConfig.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Get all pending users
router.get("/pending-users", protect, adminOnly, async (req, res) => {
  try {
    const query = `
      SELECT id, first_name AS firstName, last_name AS lastName, email, city, role, status
      FROM users
      WHERE status = 'pending'
    `;
    const [results] = await db.query(query);
    res.json({ users: results });
  } catch (err) {
    console.error("❌ Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ✅ Approve user + send activation email
router.post("/approve/:id", protect, adminOnly, async (req, res) => {
  const userId = req.params.id;

  try {
    // Generate activation token
    const activationToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    // Fetch user details
    const [rows] = await db.query(
      "SELECT email, first_name, vu_id FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email: userEmail, first_name: firstName, vu_id } = rows[0];

    // Create activation link
    const activationLink = `http://localhost:5173/login?token=${activationToken}`;

    // Email setup
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Activate Your Account",
      html: `
        <p>Hello ${firstName},</p>
        <p>Your account has been approved! Click below to activate your account:</p>
        <a href="${activationLink}">Activate Now (${vu_id})</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    // Send activation email
    await transporter.sendMail(mailOptions);

    // Update user status + token in DB
    await db.query(
      "UPDATE users SET status = 'approved', activationToken = ? WHERE id = ?",
      [activationToken, userId]
    );

    res.json({ message: "✅ User approved and activation email sent!" });
  } catch (err) {
    console.error("❌ Error approving user:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ✅ Reject user
router.post("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE users SET status = 'rejected' WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "❌ User rejected successfully" });
  } catch (err) {
    console.error("❌ Error rejecting user:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ✅ Delete user
router.delete("/delete/:id", protect, adminOnly, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "🗑️ User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

export default router;
