const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",       // your MySQL password
  database: "mobile_bio_lab"
});

module.exports = db;
