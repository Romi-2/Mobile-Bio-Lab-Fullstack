import express from "express";
import crypto from "crypto";
import { db } from "../server.js";
import transporter from "../config/emailConfig.js";

const router = express.Router();

// Middleware: Check if user is admin
const isAdmin = (req, res, next) => {
  const userId = req.user?.id; // set by your auth middleware
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  db.query("SELECT role FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0 || results[0].role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  });
};

// Get pending users
router.get("/pending-users", isAdmin, (req, res) => {
  db.query("SELECT * FROM users WHERE isActivated = false", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json({ users: results });
  });
});

// Approve user & send activation email
router.post("/approve/:id", isAdmin, (req, res) => {
  const userId = req.params.id;
  const token = crypto.randomBytes(20).toString("hex");

  db.query("UPDATE users SET activationToken = ? WHERE id = ?", [token, userId], (err) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });

    db.query("SELECT email, vu_id FROM users WHERE id = ?", [userId], (err2, results) => {
      if (err2) return res.status(500).json({ message: "DB error", error: err2 });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      const user = results[0];
      const activationLink = `http://localhost:3000/activate/${user.vu_id}?token=${token}`;

      const mailOptions = {
        from: "your-email@gmail.com",
        to: user.email,
        subject: "Activate Your Mobile Bio Lab Account",
        html: `<p>Hello,</p>
               <p>Your account has been approved. Click the link below to activate:</p>
               <a href="${activationLink}">Activate Now</a>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ message: "Failed to send email", error });
        res.json({ message: "✅ User approved and activation email sent." });
      });
    });
  });
});

// Reject user
router.delete("/reject/:id", isAdmin, (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json({ message: "✅ User rejected and deleted" });
  });
});

export default router;
