import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../models/Database.js";

const router = express.Router();

// --- Helper: Generate JWT ---
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in .env file");
  }

  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const [results] = await db.query(
      `SELECT id, first_name AS firstName, last_name AS lastName, email, password, role, status, city 
       FROM users WHERE email = ?`,
      [email]
    );

    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    // ✅ Generate JWT token
    const token = generateToken(user.id, user.role);

    // ✅ Send proper success response
    return res.status(200).json({
      message: "Login successful",
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ ACTIVATE ACCOUNT
router.post("/activate", async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });

  try {
    const [result] = await db.query(
      `UPDATE users SET isActivated='Active', activationToken=NULL WHERE id=?`,
      [userId]
    );

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Account activated successfully!" });
  } catch (err) {
    console.error("Activation error:", err);
    res
      .status(500)
      .json({ success: false, message: "Database error", error: err });
  }
});

// ✅ REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role, city } = req.body;

  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      `INSERT INTO users 
       (first_name, last_name, email, password, role, city, status, isActivated) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        role || "user",
        city || null,
        "pending",
        "Inactive",
      ]
    );

    const token = generateToken(result.insertId, role || "user");

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        role: role || "user",
        status: "pending",
        city: city || null,
        isActivated: "Inactive",
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
