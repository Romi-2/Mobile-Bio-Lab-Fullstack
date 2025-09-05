// loginRoute.js
import jwt from "jsonwebtoken";
import { db } from "../server.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short expiry for access token
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // refresh token lasts longer
  );
};

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    // TODO: check password with bcrypt if hashed

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    db.query(
      "INSERT INTO refresh_tokens (userId, token, expiry) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [user.id, refreshToken],
      (err2) => {
        if (err2) return res.status(500).json({ message: "Error saving refresh token" });

        res.json({ accessToken, refreshToken, user });
      }
    );
  });
});
