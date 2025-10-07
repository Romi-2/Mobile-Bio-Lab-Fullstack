// backend/routes/adminReportRoute.js
import express from "express";
import { db } from "../models/Database.js";
import PDFDocument from "pdfkit";

const router = express.Router();

router.get("/report", async (req, res) => {
  const { role, city } = req.query;

  let query = `
    SELECT 
      first_name AS firstName, 
      last_name AS lastName, 
      vu_id AS vuId, 
      email AS vuEmail, 
      role, 
      city
    FROM users 
    WHERE 1=1
  `;
  const params = [];

  if (role) {
    query += " AND role = ?";
    params.push(role);
  }
  if (city) {
    query += " AND city LIKE ?";
    params.push(`%${city}%`);
  }

  try {
    // ✅ Directly use promise-based query
    const [rows] = await db.query(query, params);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=user_report.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("User Report", { align: "center", underline: true });
    doc.moveDown(2);

    if (!rows.length) {
      doc.text("No users found for the selected filters.", { align: "center" });
    } else {
      rows.forEach((user, i) => {
        doc
          .fontSize(12)
          .text(`${i + 1}. ${user.firstName} ${user.lastName}`)
          .text(`   VU ID: ${user.vuId}`)
          .text(`   Email: ${user.vuEmail}`)
          .text(`   Role: ${user.role}`)
          .text(`   City: ${user.city}`)
          .moveDown();
      });
    }

    doc.end();
  } catch (err) {
    console.error("❌ Error generating PDF:", err.message);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;
