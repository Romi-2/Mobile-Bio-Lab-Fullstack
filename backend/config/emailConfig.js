// backend/config/emailConfig.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bc210428773rar@vu.edu.pk",         
    pass: "ddek cdsn arcy yhgd", // Use App Password for security
  }
});

module.exports = transporter;
