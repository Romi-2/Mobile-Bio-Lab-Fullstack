const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Approve user and send activation email
router.post("/approve/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Mark as active
    user.isActive = true;
    await user.save();

    // Send activation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourvuemail@gmail.com",  // <-- replace with your VU Gmail
        pass: "yourpassword",          // <-- generate App Password from Google
      },
    });

    const activationLink = `http://localhost:3000/activate/${user._id}`;

    const mailOptions = {
      from: "yourvuemail@gmail.com",
      to: user.email,
      subject: "Account Activation",
      text: `Activate Now BC210428773\nClick here to activate: ${activationLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "User approved and activation email sent." });
  } catch (error) {
    res.status(500).json({ message: "Error approving user", error });
  }
});

module.exports = router;
