//backend/routes/adminroutes.js
import express from "express";
import { db } from "../server.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import transporter from "../emailConfig.js";
// import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Get pending users
router.get("/pending-users", protect, adminOnly, (req, res) => {
  const query = `
    SELECT id, first_name AS firstName, last_name AS lastName, email, city, role, status
    FROM users
    WHERE status = 'pending'
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ users: results });
  });
});

// ✅ Approve user + store ActivationToken + send email
router.post("/approve/:id", protect, adminOnly, (req, res) => {
  const userId = req.params.id;

  // Generate activation token
  const activationToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );
});

  // Fetch user email + vuid first
const selectQuery = "SELECT email, first_name, vuid FROM users WHERE id = ?";
db.query(selectQuery, [userId], (err, rows) => {
  if (err) {
    console.error("❌ Database error on SELECT:", err.message);
    return res.status(500).json({ message: "Database error", error: err.message });
  }
  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const userEmail = rows[0].email;
  const firstName = rows[0].first_name;
  const vuid = rows[0].vuid;   // ✅ fetch VUID
  const activationLink = `http://localhost:3000/activate/${userId}?token=${activationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Activate Your Account",
    html: `
      <p>Hello ${firstName},</p>
      <p>Your account has been approved! Click below to activate your account:</p>
      <a href="${activationLink}">Activate Now ${vuid}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (err2) => {
    if (err2) {
      console.error("❌ Email sending failed:", err2.message);
      return res.status(500).json({ message: "Email sending failed", error: err2.message });
    }

    // Email sent successfully → update user status
    const updateQuery =
      "UPDATE users SET status = 'approved', activationToken = ? WHERE id = ?";
    db.query(updateQuery, [activationToken, userId], (err3) => {
      if (err3) {
        console.error("❌ Database update failed:", err3.message);
        return res.status(500).json({ message: "Database update failed", error: err3.message });
      }
      res.json({ message: "✅ User approved and activation email sent!" });
    });
  });
});


// ✅ Reject user
router.post("/reject/:id", protect, adminOnly, (req, res) => {
  const query = `UPDATE users SET status = 'rejected' WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User rejected" });
  });
});

// ✅ Delete user
router.delete("/delete/:id", protect, adminOnly, (req, res) => {
  const query = `DELETE FROM users WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  });
});


export default router;
