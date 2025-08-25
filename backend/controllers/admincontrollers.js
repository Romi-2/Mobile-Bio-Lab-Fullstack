// backend/controllers/adminController.js
import { db } from "../server.js";   // MySQL connection
import nodemailer from "nodemailer";

// ✅ Approve User
export const approveUser = (req, res) => {
  const userId = req.params.id;

  const query = `UPDATE users SET status = 'approved' WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    // Send email notification (optional)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email || "user@example.com", // adjust this to your actual logic
      subject: "Your account has been approved",
      text: "Congratulations! Your account is now active."
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) console.error("Email error:", error);
    });

    res.json({ message: "User approved successfully" });
  });
};

// ✅ Reject User
export const rejectUser = (req, res) => {
  const userId = req.params.id;

  const query = `UPDATE users SET status = 'rejected' WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "User rejected successfully" });
  });
};

// ✅ Get Pending Users
export const getPendingUsers = (req, res) => {
  const query = `SELECT id, firstName, lastName, email FROM users WHERE status = 'pending'`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

// ✅ Update User (Admin only)
export const updateUser = (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, role, city } = req.body;

  const query = `
    UPDATE users 
    SET firstName=?, lastName=?, email=?, role=?, city=? 
    WHERE id=?`;

  db.query(query, [firstName, lastName, email, role, city, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "User updated successfully" });
  });
};

// ✅ Email transporter (configure once here)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS
  }
});
