import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // your email
    pass: "your-app-password",    // your app password (not your regular password)
  },
});

export default transporter;