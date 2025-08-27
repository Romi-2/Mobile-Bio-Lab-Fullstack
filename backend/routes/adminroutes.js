import express from "express";
import { db } from "../server.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import transporter from "../emailConfig.js";
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

  // Update user status and store activation token
  const updateQuery = `
    UPDATE users 
    SET status = 'approved', ActivationToken = ? 
    WHERE id = ?
  `;
  db.query(updateQuery, [activationToken, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    // Fetch user email for sending activation
    db.query("SELECT email, first_name FROM users WHERE id = ?", [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const userEmail = rows[0].email;
      const firstName = rows[0].first_name;

      const activationLink = `http://localhost:3000/activate/${activationToken}`;

      const mailOptions = {
        from: "yourapp@gmail.com",
        to: userEmail,
        subject: "Activate Your Account",
        text: `Hello ${firstName},\n\nClick here to activate your account: ${activationLink}\n\nThanks!`
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) return res.status(500).json({ error: "Email sending failed", details: err });
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
