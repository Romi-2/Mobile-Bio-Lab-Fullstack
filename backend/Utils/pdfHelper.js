// backend/utils/pdfHelper.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path"; // ✅ needed for absolute path

export const generateUserProfilePDF = (user, res) => {
  const doc = new PDFDocument();
  const filename = encodeURIComponent(`${user.firstName}_${user.lastName}_profile.pdf`);

  res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);

  // Add profile picture if available
  if (user.profilePicture) {
    // Use absolute path
    const imagePath = path.join(process.cwd(), "uploads", user.profilePicture);

    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, {
        fit: [100, 100],
        align: "center",
      });
      doc.moveDown();
    } else {
      console.warn("Profile picture not found:", imagePath);
    }
  }

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
