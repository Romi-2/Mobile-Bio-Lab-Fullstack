const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bc210428773rar@vu.edu.pk", // your Gmail
    pass: "ddek cdsn arcy yhgd",       // App Password, not normal password
  },
});

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, city } = req.body;

    // Check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role,
      city,
    });

    await newUser.save();

    // Send activation email
    const mailOptions = {
      from: "your-email@gmail.com",
      to: newUser.email,
      subject: "Account Activation",
      text: `Hi ${newUser.name},\n\nWelcome! Your account has been registered.\n\nActivation Code: BC210428773\n\nThank you.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("❌ Error sending email:", error);
      else console.log("✅ Activation email sent:", info.response);
    });

    res.status(201).json({ message: "User registered successfully. Activation email sent!" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Return user info including role
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,  // ✅ this determines admin/user access
      city: user.city,
      token: "dummy-jwt-token" // optional JWT
    });

  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get User Profile (testing without JWT)
router.get("/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PDFDocument = require("pdfkit");

// ✅ Admin Export Users (filter by role or city)
router.get("/export/users", async (req, res) => {
  try {
    const { role, city } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (city) filter.city = city;

    const users = await User.find(filter).select("-password");

    // Create PDF
    const doc = new PDFDocument();
    let filename = `users-report.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("User Report", { align: "center" });
    doc.moveDown();

    users.forEach((user, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${user.name} | ${user.email} | Role: ${user.role} | City: ${user.city}`
      );
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ User Export Profile
router.get("/export/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create PDF
    const doc = new PDFDocument();
    let filename = `${user.name.replace(" ", "_")}_profile.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("User Profile", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Role: ${user.role}`);
    doc.text(`City: ${user.city}`);
    if (user.studentId) doc.text(`Student ID: ${user.studentId}`);

    doc.end();
  } catch (error) {
    console.error("Error exporting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
