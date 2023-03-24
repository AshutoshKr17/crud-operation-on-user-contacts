const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "Password@123",
  database: "contacts",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database.");
});

module.exports = connection;
