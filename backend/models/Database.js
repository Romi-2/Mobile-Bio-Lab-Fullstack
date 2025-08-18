const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // change to 'postgres' if using PostgreSQL
  }
);

sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.log("DB Error: " + err));

module.exports = sequelize;
