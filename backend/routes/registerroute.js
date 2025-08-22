import express from "express";
import multer from "multer";
import mysql from "mysql2";
import { generateUserProfilePDF } from "../utils/generateUserProfilePDF.js"; // ✅ make sure this file exists

const router = express.Router();

// multer for file upload
const upload = multer({ dest: "uploads/" });

// db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mobile_bio_lab",
});

// API route for MySQL registration
router.post("/register", upload.single("profilePic"), (req, res) => {
  const { firstName, lastName, vuId, email, password, mobile, city, role } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  const sql =
    "INSERT INTO users (firstName, lastName, vuId, email, password, mobile, city, role, profilePic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [firstName, lastName, vuId, email, password, mobile, city, role, profilePic],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // ✅ User registered successfully
      const user = { firstName, lastName, email, role, city, studentId: vuId };

      // If you want to send back PDF right away:
      // generateUserProfilePDF(user, res);

      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    }
  );
});

export default router;
