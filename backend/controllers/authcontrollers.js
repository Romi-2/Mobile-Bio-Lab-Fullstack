const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = (req, res) => {
  const { firstName, lastName, vuId, email, password, role, city, mobile } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json(err);

    const newUser = {
      firstName, lastName, vuId, email, password: hash, role, city, mobile
    };

    User.create(newUser, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered successfully, waiting for Admin approval." });
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email, (err, users) => {
    if (err) return res.status(500).json(err);
    if (users.length === 0) return res.status(404).json({ msg: "User not found" });

    const user = users[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).json({ msg: "Invalid password" });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // ✅ Store token in ActivationToken column (optional)
      const query = "UPDATE users SET ActivationToken = ? WHERE id = ?";
      User.updateToken(user.id, token, (err, result) => {
        if (err) console.error("Failed to store token:", err);
      });

      res.json({ token, user });
    });
  });
};

