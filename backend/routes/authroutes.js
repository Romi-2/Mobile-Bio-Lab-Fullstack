const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

const router = express.Router();

// --- MySQL Connection ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change if needed
  password: "",       // your MySQL password
  database: "mobile_bio_lab",
});

// --- Email Transporter ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bc210428773rar@vu.edu.pk", // your Gmail
    pass: "ddek cdsn arcy yhgd",       // App Password
  },
});

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, city } = req.body;

    // check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = "INSERT INTO users (firstName, lastName, email, password, role, city) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(sql, [firstName, lastName, email, hashedPassword, role, city], (err, result) => {
        if (err) return res.status(500).json({ error: "Insert failed" });

        // send email
        const mailOptions = {
          from: "bc210428773rar@vu.edu.pk",
          to: email,
          subject: "Account Activation",
          text: `Hi ${firstName} ${lastName},\n\nWelcome! Your account has been registered.\n\nActivation Code: BC210428773\n\nThank you.`
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) console.error("❌ Email error:", error);
        });

        res.status(201).json({ message: "User registered successfully. Activation email sent!" });
      });
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      city: user.city,
      token: "dummy-jwt-token" // replace with real JWT later
    });
  });
});

// ✅ Get User Profile
router.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT id, firstName, lastName, email, role, city FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(results[0]);
  });
});

// ✅ Admin Export Users (PDF)
router.get("/export/users", (req, res) => {
  const { role, city } = req.query;
  let sql = "SELECT firstName, lastName, email, role, city FROM users WHERE 1=1";
  const params = [];

  if (role) {
    sql += " AND role = ?";
    params.push(role);
  }
  if (city) {
    sql += " AND city = ?";
    params.push(city);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const doc = new PDFDocument();
    res.setHeader("Content-disposition", 'attachment; filename="users-report.pdf"');
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text("User Report", { align: "center" });
    doc.moveDown();

    results.forEach((u, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${u.firstName} ${u.lastName} | ${u.email} | Role: ${u.role} | City: ${u.city}`
      );
      doc.moveDown(0.5);
    });

    doc.end();
  });
});

// ✅ User Export Profile (PDF)
router.get("/export/profile/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT firstName, lastName, email, role, city FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const doc = new PDFDocument();
    res.setHeader("Content-disposition", `attachment; filename="${user.firstName}_${user.lastName}_profile.pdf"`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text("User Profile", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Role: ${user.role}`);
    doc.text(`City: ${user.city}`);

    doc.end();
  });
});

module.exports = router;
