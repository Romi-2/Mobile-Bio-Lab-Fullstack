// backend/utils/pdfGenerator.js
import PDFDocument from "pdfkit";

export const generatePdf = (users) => {
  const doc = new PDFDocument();
  doc.fontSize(16).text("User Report", { align: "center" });
  doc.moveDown();

  users.forEach((u, i) => {
    doc.fontSize(12).text(`${i + 1}. ${u.firstName} ${u.lastName} (${u.role}) - ${u.city}`);
  });

  return doc;
};
