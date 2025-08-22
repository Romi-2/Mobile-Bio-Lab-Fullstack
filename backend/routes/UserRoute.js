// backend/routes/userRoutes.js
import express from "express";
import { db } from "../server.js"; // import the DB connection

const router = express.Router();

// ✅ Get all users
router.get("/", (req, res) => {
  const query = "SELECT id, firstName, lastName, email, role, city FROM users"; // adjust table/columns
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ message: "DB Error", error: err });
    }
    res.json({ users: results });
  });
});

// ✅ Get a single user by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT id, firstName, lastName, email, role, city FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user:", err);
      return res.status(500).json({ message: "DB Error", error: err });
    }
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ user: results[0] });
  });
});

export default router;
