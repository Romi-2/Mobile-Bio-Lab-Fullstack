const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user with isActive = false
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isActive: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration successful! Please wait for Admin approval.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Activate account
router.get("/activate/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "Invalid link" });

    user.isActive = true;
    await user.save();

    res.json({ message: "Account activated! You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Activation failed", error });
  }
});


module.exports = router;
