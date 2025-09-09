import express from "express";
import { db } from "../server.js"; // your existing MySQL connection
import PDFDocument from "pdfkit";

const router = express.Router();

// Generate PDF report for users with filtering
router.get("/report", async (req, res) => {
  const { role, city } = req.query; // filtering options from frontend

  let query = "SELECT firstName, lastName, vuId, vuEmail, role, city FROM users WHERE 1=1";
  let params = [];

  if (role) {
    query += " AND role = ?";
    params.push(role);
  }

  if (city) {
    query += " AND city = ?";
    params.push(city);
  }

  try {
    const [rows] = await db.query(query, params);

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("User Report", { align: "center" });
    doc.moveDown();

    rows.forEach((user, i) => {
      doc
        .fontSize(12)
        .text(`${i + 1}. ${user.firstName} ${user.lastName} | ${user.vuId} | ${user.vuEmail} | ${user.role} | ${user.city}`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;
