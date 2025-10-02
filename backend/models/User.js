import { db } from "../models/Database.js"; // adjust path if needed

const User = {
  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  updateToken: (id, token, callback) => {
    const sql = "UPDATE users SET ActivationToken = ? WHERE id = ?";
    db.query(sql, [token, id], callback);
  },
};

export default User;
File: backend/controllers/authcontrollers.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");