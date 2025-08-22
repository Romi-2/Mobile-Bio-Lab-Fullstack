// backend/testMail.js
const transporter = require("./config/emailConfig");

transporter.sendMail({
  from: '"Mobile Bio Lab" <bc210428773rar@vu.edu.pk>',
  to: "your-test-email@gmail.com",
  subject: "Test Email",
  text: "Hello, this is a test email from Mobile Bio Lab backend!",
}, (err, info) => {
  if (err) console.log("Error:", err);
  else console.log("Email sent:", info.response);
});
// This script is for testing the email configuration
// Run it with `node backend/testMail.js` to verify email sending works