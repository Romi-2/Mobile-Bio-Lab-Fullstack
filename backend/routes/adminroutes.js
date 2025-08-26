// backend/routes/adminRoutes.js
import express from "express";
import { db } from "../server.js"; // or your Database.js
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import transporter from "../emailConfig.js"; // your nodemailer config

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

// ✅ Approve user + send activation email
router.post("/approve/:id", protect, adminOnly, (req, res) => {
  const userId = req.params.id;

  const query = `UPDATE users SET status = 'approved' WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    // Get user email for sending activation link
    db.query(`SELECT email FROM users WHERE id = ?`, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const userEmail = rows[0]?.email;
      const activationLink = `http://localhost:3000/activate/${userId}`;

      const mailOptions = {
        from: "yourapp@gmail.com",
        to: userEmail,
        subject: "Account Activation",
        text: `Active Now BC220XXXXXX\nClick here to activate: ${activationLink}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.status(500).json({ error: "Email failed", details: err });
        res.json({ message: "User approved and activation email sent" });
      });
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
