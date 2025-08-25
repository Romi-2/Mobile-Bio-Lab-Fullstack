// backend/routes/loginRoute.js
import express from "express";
import { db } from "../server.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/login
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = `
    SELECT 
      id,
      first_name AS firstName,
      last_name AS lastName,
      email,
      password,
      role,
      status
    FROM users
    WHERE email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    // ✅ Return user object including status
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status, // important for frontend approval check
      },
    });
  });
});

export default router;
