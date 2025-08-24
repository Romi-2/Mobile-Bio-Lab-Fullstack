import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { db } from "../server.js"; // MySQL connection
import transporter from "../emailConfig.js"; // Email transporter


const router = express.Router();

// ✅ Middleware to check if user is admin
// You need some auth mechanism (JWT/session) to set req.user.id
const isAdmin = (req, res, next) => {
  const userId = req.user?.id; // Set this from your auth middleware

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  db.query("SELECT role FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });

    if (results.length === 0 || results[0].role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  });
};

// ✅ Approve user and send activation email
router.post("/approve/:id", isAdmin, (req, res) => {
  const userId = req.params.id;

  // Generate activation token
  const token = crypto.randomBytes(20).toString("hex");

  // Update user with token
  db.query(
    "UPDATE users SET activationToken = ? WHERE id = ?",
    [token, userId],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      // Fetch user email and vu_id
      db.query("SELECT email, vu_id FROM users WHERE id = ?", [userId], (err2, results) => {
        if (err2) return res.status(500).json({ message: "DB error", error: err2 });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        const user = results[0];

  
        const activationLink = `http://localhost:3000/activate/${user.vu_id}?token=${token}`;

        const mailOptions = {
          from: "yourvuemail@gmail.com",
          to: user.email,
          subject: "Account Activation",
          html: `<p>Hello,</p>
                 <p>Your account has been approved. Click the link below to activate:</p>
                 <a href="${activationLink}">Activate Now</a>`,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) return res.status(500).json({ message: "Failed to send email", error });

          res.json({ message: "✅ User approved and activation email sent." });
        });
      });
    }
  );
});

// ✅ Admin updates limited user profile details
router.put("/update/:id", isAdmin, (req, res) => {
  const { email, city, profilePicture } = req.body;
  const userId = req.params.id;

  const fields = [];
  const values = [];

  if (email) { fields.push("email = ?"); values.push(email); }
  if (city) { fields.push("city = ?"); values.push(city); }
  if (profilePicture) { fields.push("profilePicture = ?"); values.push(profilePicture); }

  if (fields.length === 0) return res.status(400).json({ message: "No fields to update" });

  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  values.push(userId);

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json({ message: "✅ User profile updated successfully" });
  });
});

export default router;
