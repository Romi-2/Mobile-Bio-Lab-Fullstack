const User = require("../models/User");
const PDFDocument = require("pdfkit");

exports.exportUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.city) filters.city = req.query.city;

    // Exclude password
    const users = await User.find(filters).select("-password");

    const doc = new PDFDocument({ margin: 30 });
    const filename = "users_report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Users Report", { align: "center" });
    doc.moveDown();

    // Table headers
    doc.fontSize(14).text("S.No  |  Name                |  VU ID     |  Email                |  Role        |  City");
    doc.moveDown(0.5);

    // User rows
    users.forEach((user, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. ${user.firstName} ${user.lastName} | ${user.vuId} | ${user.vuEmail} | ${user.role} | ${user.city}`
        );
      doc.moveDown(0.3);
    });

    doc.end();
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
