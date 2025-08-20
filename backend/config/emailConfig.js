// backend/config/emailConfig.js
import nodemailer from "nodemailer";
// Configure your email transporter
// Use your Gmail or SMTP settings
// Make sure to use App Passwords for security
// https://support.google.com/accounts/answer/185201?hl=en

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bc210428773rar@vu.edu.pk",         
    pass: "ddek cdsn arcy yhgd", // Use App Password for security
  }
});

module.exports = transporter;
