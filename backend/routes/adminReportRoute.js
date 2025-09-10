import express from "express";
import { db } from "../server.js";
import PDFDocument from "pdfkit";

const router = express.Router(); // ✅ this was missing

// helper function to wrap db.query in a Promise
function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Generate PDF report for users with filtering
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
  let params = [];

  if (role) {
    query += " AND role = ?";
    params.push(role);
  }

  if (city) {
    query += " AND city LIKE ?";
    params.push(`%${city}%`);
  }

  console.log("📌 SQL:", query, params);

  try {
    const rows = await queryAsync(query, params);
    console.log("📌 Rows fetched:", rows.length);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("User Report", { align: "center" });
    doc.moveDown();

    if (rows.length === 0) {
      doc.fontSize(12).text("No users found for the selected filters.");
    } else {
      rows.forEach((user, i) => {
        doc
          .fontSize(12)
          .text(`${i + 1}. Name: ${user.firstName} ${user.lastName}`, { lineGap: 2 })
          .text(`   VuID: ${user.vuId}`, { lineGap: 2 })
          .text(`   Email: ${user.vuEmail}`, { lineGap: 2 })
          .text(`   Role: ${user.role}`, { lineGap: 2 })
          .text(`   City: ${user.city}`, { lineGap: 4 })
          .moveDown();
      });
    }

    doc.end();
  } catch (err) {
    console.error("❌ Error generating PDF:", err.sqlMessage || err.message);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
});

export default router;
