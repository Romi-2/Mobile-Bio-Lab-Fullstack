const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",     // Replace with your Gmail
    pass: "your-app-password",        // Use Google App Password
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

module.exports = router;
