import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2";
import transporter from "./config/emailConfig.js";
import profileExportRoute from "./routes/profileExportRoute.js";
import registerRoute from "./routes/registerRoute.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(bodyParser.json());

// ---------- Database ----------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mobile_bio_lab",
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err.message);
  else console.log("✅ Connected to MySQL database");
});

export { db };

// ---------- Routes ----------
app.use("/api/export", profileExportRoute);
app.use("/api/register", registerRoute);
app.use("/api/users", userRoutes);

// Test DB connection
app.get("/api/test-db", (req, res) => {
  db.query("SELECT NOW() AS now", (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    res.json({ message: "DB connected", serverTime: results[0].now });
  });
});

// ---------- Email Demo ----------
let users = [];
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
             <p>Your account has been created. Click below to activate:</p>
             <a href="${activationLink}">Activate Now (${studentId})</a>`,
    });
    res.status(201).json({ message: "User registered. Activation email sent!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

app.get("/api/activate/:studentId", (req, res) => {
  const { studentId } = req.params;
  const user = users.find((u) => u.studentId === studentId);
  if (user) {
    user.status = "active";
    return res.send(`<h2>✅ Account Activated Successfully for ${studentId}</h2>`);
  }
  res.status(404).send("<h2>❌ Invalid Activation Link</h2>");
});

// ---------- Start Server ----------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

export default app;