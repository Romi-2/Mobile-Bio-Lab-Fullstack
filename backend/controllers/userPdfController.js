// backend/controllers/userPdfController.js
import { db } from "../models/Database.js";
import PDFDocument from "pdfkit";

export const exportUserProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT first_name AS firstName, last_name AS lastName, email, role, city, vu_id AS vuId FROM users WHERE id = ?",
      [req.params.id]
    );

    const user = rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    const doc = new PDFDocument();
    const filename = encodeURIComponent(`${user.firstName}_${user.lastName}_profile.pdf`);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Header
    doc.fontSize(20).text("User Profile", { align: "center" });
    doc.moveDown(1);

    // Profile details
    doc.fontSize(14).text(`Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Role: ${user.role}`);
    doc.text(`City: ${user.city || "N/A"}`);
    doc.text(`VU ID: ${user.vuId || "N/A"}`);

    doc.end();
  } catch (error) {
    console.error("❌ Error exporting profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
