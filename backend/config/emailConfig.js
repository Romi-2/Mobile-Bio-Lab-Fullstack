// backend/config/emailConfig.js
const nodemailer = require("nodemailer");

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bc210428773rar@vu.edu.pk", // your Gmail
    pass: "ddek cdsn arcy yhgd",       // App Password, not normal password
  },
});

module.exports = transporter;
