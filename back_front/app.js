const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Also handle JSON requests

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "host_try1",
  password: "host_try1",
  database: "host_try1",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

connection.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to MySQL");
});

// Home Route
app.get("/", (req, res) => res.send("Up and running..."));

// Install Route (Create Table)
app.get("/install", (req, res) => {
  const createProducts = `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`;

  connection.query(createProducts, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error creating table");
    }
    res.send("Tables Created Successfully");
  });
});

// 🚀 Secure Login/Signup Route
app.post("/add-product", (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).send("Missing username or password");
  }

  // Secure SQL Insert
  const insertProduct = `INSERT INTO products (user_name, password) VALUES (?, ?)`;
  connection.query(insertProduct, [user_name, password], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }

    // Secure SQL Select
    const selectPID = `SELECT id FROM products WHERE user_name = ?`;
    connection.query(selectPID, [user_name], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }

      const PId = result[0].id;
      res.send(`User registered with ID: ${PId}`);
    });
  });
});

// Start Server
app.listen(2020, () => console.log("Server running on http://localhost:2020"));
