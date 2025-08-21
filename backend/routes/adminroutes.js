const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ✅ Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // Assuming you store userId in req.user from JWT or session
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin check failed", error });
  }
};

// ✅ Approve user and send activation email
router.post("/approve/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Activate user
    user.isActive = true;
    await user.save();

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourvuemail@gmail.com",  // replace with your VU email
        pass: "your-app-password",      // use Google App Password
      },
    });

    const activationLink = `http://localhost:3000/activate/${user._id}`;

    const mailOptions = {
      from: "yourvuemail@gmail.com",
      to: user.email,
      subject: "Account Activation",
      text: `Hello ${user.name},\n\nYour account has been approved.\nClick here to activate your account: ${activationLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "✅ User approved and activation email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving user", error });
  }
});

// ✅ Admin updates limited user profile details
router.put("/update/:id", isAdmin, async (req, res) => {
  try {
    const { email, city, profilePicture } = req.body;

    // Only update allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(email && { email }),
        ...(city && { city }),
        ...(profilePicture && { profilePicture }),
      },
      { new: true } // return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "✅ User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user profile", error });
  }
});

module.exports = router;
