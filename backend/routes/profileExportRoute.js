// backend/routes/profileExportRoute.js
import express from "express";
import User from "../models/User.js";
import { generateUserProfilePDF } from "/utils/pdfHelper.js";

const router = express.Router();

// ✅ Export user profile to PDF
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    generateUserProfilePDF(user, res);
  } catch (error) {
    console.error("Error exporting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
