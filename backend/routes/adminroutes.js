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
      SELECT id, first_name AS firstName, last_name AS lastName, email, city, role, status, vu_id
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

// ✅ Approve user + send login email
router.post("/approve/:id", protect, adminOnly, async (req, res) => {
  const userId = req.params.id;

  console.log("🎯 ADMIN APPROVAL STARTED FOR USER:", userId);

  try {
    // Generate activation token (for auto-activation during login)
    const activationToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "30d" } // 30 days expiry
    );

    console.log("🔑 Activation token generated");

    // Fetch user details
    const [rows] = await db.query(
      "SELECT email, first_name, vu_id FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email: userEmail, first_name: firstName, vu_id } = rows[0];

    // Create login link (redirects to login page)
    const loginLink = `http://localhost:5173/login`;

    // Email setup - now tells user to login instead of activate
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Account Has Been Approved",
      html: `
        <p>Hello ${firstName},</p>
        <p>Your account has been approved! You can now login to activate your account.</p>
        <p><strong>VU ID: ${vu_id}</strong></p>
        <a href="${loginLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Login to Activate Account</a>
        <p>Your account will be automatically activated when you login for the first time.</p>
        <p><em>If the button doesn't work, copy and paste this link in your browser:</em><br/>
        http://localhost:5173/login</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Update user status + store activation token for auto-activation
    await db.query(
      "UPDATE users SET status = 'approved', activationToken = ?, isActivated = 'Inactive' WHERE id = ?",
      [activationToken, userId]
    );

    console.log("✅ User approved - activation token stored, login email sent");

    res.json({ message: "✅ User approved and login email sent!" });
  } catch (err) {
    console.error("❌ Error approving user:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ✅ Reject user
router.post("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE users SET status = 'rejected', activationToken = NULL WHERE id = ?",
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

router.get("/dashboard-stats", protect, adminOnly, async (req, res) => {
  try {
    const [total] = await db.query(`
      SELECT COUNT(*) AS totalUsers FROM users
    `);

    const [pending] = await db.query(`
      SELECT COUNT(*) AS pendingUsers
      FROM users
      WHERE LOWER(status) = 'pending'
    `);

    const [admins] = await db.query(`
      SELECT COUNT(*) AS adminCount
      FROM users
      WHERE LOWER(role) = 'admin'
    `);

    res.json({
      totalUsers: total[0].totalUsers,
      pendingUsers: pending[0].pendingUsers,
      admins: admins[0].adminCount,
    });
  } catch (err) {
    console.error("❌ Dashboard stats error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});



export default router;