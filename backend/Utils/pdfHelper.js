// backend/utils/pdfHelper.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateUserProfilePDF = (user, res) => {
  try {
    const doc = new PDFDocument();
    const filename = encodeURIComponent(`${user.firstName}_${user.lastName}_profile.pdf`);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // ✅ Safely handle profile picture path
    if (user.profilePicture) {
      let relativePath = user.profilePicture.replace(/^\/+/, ""); // remove leading slash if any
      const imagePath = path.join(process.cwd(), relativePath);

      if (fs.existsSync(imagePath)) {
        doc.image(imagePath, { fit: [100, 100], align: "center" });
        doc.moveDown();
      } else {
        console.warn("⚠️ Profile picture not found:", imagePath);
      }
    }

    // ✅ Add text content
    doc.fontSize(20).text("User Profile", { align: "center" });
    doc.moveDown();
    doc.fontSize(14)
      .text(`First Name: ${user.firstName}`)
      .text(`Last Name: ${user.lastName}`)
      .text(`Email: ${user.email}`)
      .text(`Role: ${user.role}`)
      .text(`City: ${user.city}`)
      .text(`Student ID: ${user.studentId || "N/A"}`);

    doc.end();

    // Log success
    console.log(`✅ PDF generated for ${user.firstName} ${user.lastName}`);
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
