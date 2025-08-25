// backend/routes/adminRoutes.js
import express from "express";
import { db } from "../server.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: verify admin token
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Not authorized" });

    req.admin = decoded;
    next();
  });
}

// ✅ GET pending users
router.get("/pending-users", verifyAdmin, (req, res) => {
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

// ✅ POST approve user
router.post("/approve/:id", verifyAdmin, (req, res) => {
  const query = `UPDATE users SET status = 'approved' WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User approved" });
  });
});

// ✅ POST reject user
router.post("/reject/:id", verifyAdmin, (req, res) => {
  const query = `UPDATE users SET status = 'rejected' WHERE id = ?`;
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User rejected" });
  });
});

export default router;
