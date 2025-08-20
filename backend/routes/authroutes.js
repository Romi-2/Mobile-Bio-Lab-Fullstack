const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // adjust path if your model is elsewhere
const transporter = require("../config/emailConfig");

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, city } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      city,
    });

    await newUser.save();

    // ✅ Send activation email
    const mailOptions = {
      from: "your-email@gmail.com",          // your Gmail
      to: newUser.email,                     // send to user's email
      subject: "Account Activation",
      text: `Hi ${newUser.firstName},\n\nWelcome! Your account has been registered.\n\nActivation Code: BC210428773\n\nThank you.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending email:", error);
      } else {
        console.log("✅ Activation email sent:", info.response);
      }
    });

    res.status(201).json({ message: "User registered successfully. Activation email sent!" });

  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
