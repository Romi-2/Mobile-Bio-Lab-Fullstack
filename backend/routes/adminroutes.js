const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection
const nodemailer = require("nodemailer");

// ✅ 1. Get all users (with optional filters city/role)
router.get("/users", async (req, res) => {
  try {
    const { city, role } = req.query;
    let query = "SELECT id, first_name, last_name, role, city, is_verified FROM users WHERE 1=1";
    let params = [];

    if (city) {
      query += " AND city = ?";
      params.push(city);
    }
    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    const [rows] = await db.execute(query, params);

    const users = rows.map((u) => ({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      role: u.role,
      city: u.city,
      isVerified: !!u.is_verified
    }));

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


// ✅ 2. Verify user & send activation email
router.put("/users/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const activationToken = "Activate Now BC" + Date.now(); // example token

    await db.execute(
      "UPDATE users SET is_verified = 1, activation_token = ? WHERE id = ?",
      [activationToken, id]
    );

    // get email
    const [user] = await db.execute("SELECT email FROM users WHERE id = ?", [id]);

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // send email
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com", // replace
        pass: "your_password"         // replace
      },
    });

    await transporter.sendMail({
      from: "your_email@gmail.com",
      to: user[0].email,
      subject: "Account Activation",
      text: `Click this link to activate your account: http://localhost:3000/activate/${activationToken}`,
    });

    res.json({ message: "User verified and activation email sent" });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ error: "Failed to verify user" });
  }
});


// ✅ 3. Update limited fields (email, city, profile picture)
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, city, profile_picture } = req.body;

    await db.execute(
      "UPDATE users SET email = ?, city = ?, profile_picture = ? WHERE id = ?",
      [email, city, profile_picture, id]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});


// ✅ 4. Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
