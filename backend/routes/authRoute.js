// authRoute.js
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

// ✅ Register Route
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role, city } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check if email already exists
    db.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // insert new user
      db.query(
        "INSERT INTO users (first_name, last_name, email, password, role, city, status, isActivated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [firstName, lastName, email, hashedPassword, role || "user", city || null, "pending", "Inactive"],
        (err, result) => {
          if (err) {
            console.error("Insert Error:", err);
            return res.status(500).json({ message: "Database insert error" });
          }

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
              isActivated: "Inactive"
            }
          });
        }
      );
    });
  } catch (err) {
    console.error("Catch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
