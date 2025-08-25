// backend/routes/userRoutes.js
import express from "express";
import { db } from "../server.js"; // import your MySQL connection
import jwt from "jsonwebtoken";

const router = express.Router();

// --------------------
// Middleware to verify token (optional for public routes like activation)
// --------------------
function verifyUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// --------------------
// GET all users
// --------------------
router.get("/", verifyUser, (req, res) => {
  const query = `
    SELECT id, first_name AS firstName, last_name AS lastName, email, role, city, status
    FROM users
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ users: results });
  });
});

// --------------------
// GET single user by ID
// --------------------
router.get("/:id", verifyUser, (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, first_name AS firstName, last_name AS lastName, email, role, city, status
    FROM users
    WHERE id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ user: results[0] });
  });
});

// --------------------
// CREATE new user
// --------------------
router.post("/", verifyUser, (req, res) => {
  const { firstName, lastName, email, password, role, city } = req.body;

  if (!firstName || !lastName || !email || !password || !role)
    return res.status(400).json({ message: "All required fields must be provided" });

  const query = `
    INSERT INTO users (first_name, last_name, email, password, role, city, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `;
  db.query(query, [firstName, lastName, email, password, role, city], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  });
});

// --------------------
// UPDATE user
// --------------------
router.put("/:id", verifyUser, (req, res) => {
  const { firstName, lastName, email, role, city } = req.body;
  const { id } = req.params;

  const query = `
    UPDATE users
    SET first_name = ?, last_name = ?, email = ?, role = ?, city = ?
    WHERE id = ?
  `;
  db.query(query, [firstName, lastName, email, role, city, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  });
});

// --------------------
// DELETE user
// --------------------
router.delete("/:id", verifyUser, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  });
});

// --------------------
// ACTIVATE user account (public route, no token required)
// --------------------
router.get("/activate/:studentId", (req, res) => {
  const { studentId } = req.params;
  const token = req.query.token;

  const selectQuery = `
    SELECT * FROM users
    WHERE vu_id = ? AND activationToken = ? AND isActivated = false
  `;
  db.query(selectQuery, [studentId, token], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0)
      return res.json({ success: false, message: "Invalid or expired activation link" });

    const updateQuery = `
      UPDATE users
      SET isActivated = true, activationToken = NULL
      WHERE vu_id = ?
    `;
    db.query(updateQuery, [studentId], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: "Server error" });
      res.json({ success: true, message: "Your account has been activated!" });
    });
  });
});

export default router;
