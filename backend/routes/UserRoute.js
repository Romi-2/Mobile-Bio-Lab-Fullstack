// backend/routes/userRoute.js
import express from "express";
import { db } from "../models/Database.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// --------------------
// ACTIVATE user account
// --------------------
router.get("/activate/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const token = req.query.token;

    const [results] = await db.query(
      `SELECT * FROM users WHERE vu_id = ? AND activationToken = ? AND isActivated = false`,
      [studentId, token]
    );

    if (results.length === 0) {
      return res.json({ success: false, message: "Invalid or expired activation link" });
    }

    await db.query(
      `UPDATE users SET isActivated = true, activationToken = NULL WHERE vu_id = ?`,
      [studentId]
    );

    res.json({ success: true, message: "Your account has been activated!" });
  } catch (err) {
    console.error("Activation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------------
// GET all users (admin only)
// --------------------
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT id, first_name AS firstName, last_name AS lastName, email, role, city, status
      FROM users
    `);

    res.json({ users: results });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// --------------------
// GET single user by ID
// --------------------
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await db.query(
      `SELECT id, first_name AS firstName, last_name AS lastName, email, role, city, status FROM users WHERE id = ?`,
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: results[0] });
  } catch (err) {
    console.error("Error fetching single user:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// --------------------
// CREATE new user
// --------------------
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, city } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const [result] = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, role, city, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [firstName, lastName, email, password, role, city]
    );

    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// --------------------
// UPDATE user
// --------------------
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, email, role, city } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ?, city = ? WHERE id = ?`,
      [firstName, lastName, email, role, city, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

export default router;
