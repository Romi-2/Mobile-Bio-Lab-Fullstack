const User = require("../models/User");
const PDFDocument = require("pdfkit");

exports.exportUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const doc = new PDFDocument();
    let filename = `${user.name.replace(" ", "_")}_profile.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("User Profile", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Role: ${user.role}`);
    doc.text(`City: ${user.city}`);
    if (user.studentId) doc.text(`Student ID: ${user.studentId}`);

    doc.end();
  } catch (error) {
    console.error("Error exporting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const nodemailer = require("nodemailer");