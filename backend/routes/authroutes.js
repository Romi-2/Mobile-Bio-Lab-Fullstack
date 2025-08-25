// backend/routes/authRoute.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../server.js";

const router = express.Router();

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

  // Fetch user including status
  db.query(
    "SELECT id, first_name AS firstName, last_name AS lastName, email, password, role, status, city FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      const user = results[0];

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

      // Generate JWT
      const token = generateToken(user.id, user.role);

      // Return user object including status
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status, // ✅ frontend will read this
          city: user.city,
        },
      });
    }
  );
});

export default router;
