// backend/routes/loginRoute.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../models/Database.js";

const router = express.Router();

// --- Helper: Generate Tokens ---
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" }
  );
};

// ✅ LOGIN ROUTE WITH AUTO-ACTIVATION
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login attempt for:", email);

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    
    if (results.length === 0) {
      console.log("❌ User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    
    // 🔍 DEBUGGING INFORMATION
    console.log("=== DEBUG USER STATUS ===");
    console.log("User ID:", user.id);
    console.log("Email:", user.email);
    console.log("Status:", user.status);
    console.log("isActivated:", user.isActivated);
    console.log("Has activationToken:", !!user.activationToken);

    // Check account status
    if (user.status === "pending") {
      console.log("⏳ Account pending approval - BLOCKING");
      return res.status(403).json({ message: "Your account is still pending approval." });
    }

    // ✅ AUTO-ACTIVATION: If user has activation token, activate automatically
    if (user.isActivated === "Inactive" && user.activationToken) {
      console.log("🔄 AUTO-ACTIVATION: User has activation token - activating automatically");
      
      try {
        // Verify the activation token is still valid
        jwt.verify(user.activationToken, process.env.JWT_SECRET || "secretkey");
        
        // Activate the user and clear the token
        const [updateResult] = await db.query(
          `UPDATE users SET isActivated = 'Active', activationToken = NULL WHERE id = ?`,
          [user.id]
        );
        
        if (updateResult.affectedRows > 0) {
          console.log("✅ AUTO-ACTIVATION SUCCESS: User activated:", user.email);
          // Update user object for response
          user.isActivated = 'Active';
        } else {
          console.log("❌ AUTO-ACTIVATION FAILED: No rows affected");
        }
      } catch (tokenError) {
        console.log("❌ AUTO-ACTIVATION: Token invalid or expired:", tokenError.message);
        // Continue with normal login flow - user will see activation error below
      }
    }

    // Check if still inactive after auto-activation attempt
    if (user.isActivated === "Inactive") {
      console.log("🚫 Account still Inactive after auto-activation attempt");
      
      // Check if user has an activation token (but it might be expired)
      if (user.activationToken) {
        return res.status(403).json({ 
          message: "Activation link expired. Please contact administrator for a new activation link." 
        });
      } else {
        return res.status(403).json({ 
          message: "Please activate your account first. Check your email for activation link." 
        });
      }
    }

    console.log("✅ Activation check PASSED - user is Active");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch - BLOCKING");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅✅✅ LOGIN SUCCESSFUL");
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    await db.query(
      `INSERT INTO refresh_tokens (userId, token, expiry) 
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [user.id, refreshToken]
    );

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        city: user.city,
        isActivated: user.isActivated,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;