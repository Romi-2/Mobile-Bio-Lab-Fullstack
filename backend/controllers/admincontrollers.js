const User = require("../models/User");
const { generatePdf } = require("../utils/pdfGenerator");

exports.verifyUser = (req, res) => {
  // Here you will update status = verified and send activation email
  res.json({ msg: "User verified, activation email sent." });
};

exports.listUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) return res.status(500).json(err);
    res.json(users);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  User.delete(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "User deleted" });
  });
};

exports.exportUsersPdf = (req, res) => {
  User.getAll((err, users) => {
    if (err) return res.status(500).json(err);

    const pdfBuffer = generatePdf(users);
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  });
};
