import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../server.js";

const router = express.Router(); // only once

// --- Helper: Generate JWT ---
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );
};

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  db.query(
    "SELECT id, first_name AS firstName, last_name AS lastName, email, password, role, status, city FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

      const token = generateToken(user.id, user.role);

      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          city: user.city,
        },
      });
    }
  );
});
// ✅ Activate account route
router.post("/activate", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  const query = `UPDATE users SET isActivated='Active', activationToken=NULL WHERE id=?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Account activated successfully!" });
  });
});



export default router;
