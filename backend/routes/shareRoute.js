import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { db } from "../models/Database.js";

dotenv.config();

const router = express.Router();

// POST /api/share/email
router.post("/email", async (req, res) => {
  const { to, subject, message, sampleId } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Get complete sample details
    let sampleDetails = "";
    if (sampleId) {
      const [rows] = await db.query(
        `SELECT 
          sample_id,
          sample_type,
          collection_date,
          collection_time,
          geo_location,
          temperature,
          pH,
          salinity
         FROM reservations 
         WHERE sample_id = ? OR id = ?`, 
        [sampleId, sampleId]
      );
      
      if (rows.length > 0) {
        const sample = rows[0];
        sampleDetails = `

Sample Data Details:
────────────────────
• Sample ID: ${sample.sample_id || sampleId}
• Sample Type: ${sample.sample_type || 'N/A'}
• Collection Date: ${sample.collection_date || 'N/A'}
• Collection Time: ${sample.collection_time || 'N/A'}
• Geolocation: ${sample.geo_location || 'N/A'}
• Temperature: ${sample.temperature || 'N/A'}°C
• pH Level: ${sample.pH || 'N/A'}
• Salinity: ${sample.salinity || 'N/A'} PSU

`;
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailMessage = (message || "I wanted to share this sample data with you.") + 
      sampleDetails + 
      `\nView full details and analysis: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/sample/${sampleId}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: emailMessage,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

export default router;