// backend/controllers/adminPdfController.js
import { db } from "../models/Database.js";
import PDFDocument from "pdfkit";

export const exportUsers = async (req, res) => {
  try {
    const { role, city } = req.query;

    // Build dynamic SQL
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

    const [users] = await db.query(query, params);

    // Create PDF
    const doc = new PDFDocument({ margin: 30 });
    const filename = "users_report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Users Report", { align: "center" });
    doc.moveDown(1.5);

    // Table headers
    doc
      .fontSize(13)
      .text(
        "S.No  |  Name                     |  VU ID       |  Email                        |  Role        |  City",
        { align: "left" }
      );
    doc.moveDown(0.5);

    // Table content
    if (users.length === 0) {
      doc.fontSize(12).text("No users found for the selected filters.", { align: "center" });
    } else {
      users.forEach((user, i) => {
        const name = `${user.firstName} ${user.lastName}`;
        doc
          .fontSize(12)
          .text(
            `${i + 1}. ${name.padEnd(25)} | ${user.vuId || "-"} | ${user.vuEmail} | ${user.role} | ${user.city || "-"}`
          );
        doc.moveDown(0.3);
      });
    }

    doc.end();
  } catch (error) {
    console.error("❌ Error exporting users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
