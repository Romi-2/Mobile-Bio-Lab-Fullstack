import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// User should only see their own status
router.get("/status", protect, async (req, res) => {
  try {
    // You already have req.user from the token
    res.json({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      status: "active", // you can fetch from DB if needed
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user status" });
  }
});

export default router;
