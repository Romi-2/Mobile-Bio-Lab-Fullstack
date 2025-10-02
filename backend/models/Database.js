// Path: backend/models/Database.js
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mobile_bio_lab",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
