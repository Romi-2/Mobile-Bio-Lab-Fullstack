const User = require("../models/User");
const PDFDocument = require("pdfkit");

exports.exportUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.city) filters.city = req.query.city;

    const users = await User.find(filters).select("-password");

    const doc = new PDFDocument({ margin: 30 });
    const filename = "users_report.pdf";

    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Users Report", { align: "center" });
    doc.moveDown();

    users.forEach((user, i) => {
      doc.fontSize(12).text(`${i + 1}. ${user.name} | ${user.email} | ${user.role} | ${user.city}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

