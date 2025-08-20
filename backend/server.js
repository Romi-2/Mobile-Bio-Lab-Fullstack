import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import transporter from "./emailConfig.js";  // ✅ import here

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [];

app.post("/api/register", async (req, res) => {
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
             <a href="${activationLink}">Activate Now ${studentId}</a>`,
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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

export default app;