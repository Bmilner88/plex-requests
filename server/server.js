const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

app.use(express.json());
app.use(cors());

app.get("/api/requests", async (req, res) => {
  try {
    // Get all requests
    const result = await pool.query("SELECT * FROM requests r");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/send", async (req, res) => {
  console.log(`Request recieved ${JSON.stringify(req.body)}`);
  // Get form and user data
  const { title, year, requestor, status, type } = req.body;

  try {
    // Run SQL query to insert data
    const result = await pool.query(
      "INSERT INTO requests(request_title, request_year, request_requestor, request_status, request_timestamp, request_type) VALUES($1, $2, $3, $4, NOW(), $5) RETURNING *",
      [title, year, requestor, status, type]
    );

    // Send back the inserted data
    res.status(201).json({
      message: "POST success",
      item: result.rows[0],
    });
  } catch (err) {
    console.error("POST failure:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
