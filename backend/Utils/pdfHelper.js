// backend/utils/pdfHelper.js
import PDFDocument from "pdfkit";

export const generateUserProfilePDF = (user, res) => {
  const doc = new PDFDocument();
  const filename = encodeURIComponent(`${user.firstName}_${user.lastName}_profile.pdf`);

  res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text("User Profile", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`First Name: ${user.firstName}`);
  doc.text(`Last Name: ${user.lastName}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Role: ${user.role}`);
  doc.text(`City: ${user.city}`);
  doc.text(`Student ID: ${user.studentId || "N/A"}`);

  doc.end();
};
