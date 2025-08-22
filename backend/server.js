import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import transporter from "./config/emailConfig.js";   // ✅ email config
import profileExportRoute from "./routes/profileExportRoute.js";  // ✅ pdf route
import registerRoute from "./routes/registerRoute.js";            // ✅ mysql register route
import userRoutes from "./routes/userRoutes.js";
app.use("/api", userRoutes);
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/export", profileExportRoute);   // export profile as PDF
app.use("/api", registerRoute);               // register users (MySQL)

// Temporary in-memory array (for email activation demo only)
let users = [];

// ---------- Email-based Registration (demo) ----------
app.post("/api/register-email", async (req, res) => {
  const { username, email, password, studentId } = req.body;

  const newUser = { username, email, password, studentId, status: "pending" };
  users.push(newUser);

  try {
    const activationLink = `http://localhost:5000/api/activate/${studentId}`;

    await transporter.sendMail({
      from: '"Mobile Bio Lab" <your-email@gmail.com>',
      to: email,
      subject: "Activate Your Account",
      html: `<h3>Hello ${username},</h3>
             <p>Your account has been created successfully. Please click the link below to activate:</p>
             <a href="${activationLink}">Activate Now (${studentId})</a>`,
    });

    res.status(201).json({ message: "User registered. Activation email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
});

app.get("/api/activate/:studentId", (req, res) => {
  const { studentId } = req.params;
  let user = users.find((u) => u.studentId === studentId);

  if (user) {
    user.status = "active";
    return res.send(`<h2>Account Activated Successfully for ${studentId} 🎉</h2>`);
  }
  res.status(404).send("<h2>Invalid Activation Link</h2>");
});

// ---------- Start Server ----------
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});

export default app;
