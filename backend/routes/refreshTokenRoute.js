import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../server.js";

const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
};

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Missing refresh token" });

  // Check if refresh token exists in DB
  db.query("SELECT * FROM refresh_tokens WHERE token = ?", [refreshToken], (err, results) => {
    if (err || results.length === 0) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err2, user) => {
      if (err2) return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
      res.json({ accessToken: newAccessToken });
    });
  });
});

export default router;
