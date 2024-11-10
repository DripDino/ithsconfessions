const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up PostgreSQL connection using the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // This uses the environment variable for the database URL
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint to get all confessions
app.get('/confessions', async (req, res) => {
  try {
    const result = await pool.query('SELECT content FROM confessions ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to post a new confession
app.post('/confessions', async (req, res) => {
  const { content } = req.body;
  try {
    await pool.query('INSERT INTO confessions (content) VALUES ($1)', [content]);
    res.status(201).send("Confession added");
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
