// backend/utils/pdfHelper.js
import PDFDocument from "pdfkit";

export const generateUserProfilePDF = (user, res) => {
  try {
    const doc = new PDFDocument();
    let filename = `${user.firstName}_${user.lastName}_profile.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("User Profile", { align: "center" });
    doc.moveDown();

    // User info
    doc.fontSize(14).text(`First Name: ${user.firstName}`);
    doc.text(`Last Name: ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Role: ${user.role}`);
    doc.text(`City: ${user.city}`);
    doc.text(`Student ID: ${user.studentId || "N/A"}`);

    doc.end();
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
};
