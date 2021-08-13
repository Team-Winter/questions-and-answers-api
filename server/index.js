const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg');

// uncomment if needed:
// const cors = require('cors');
app.use(express.json());
// app.use(cors());

const pool = new Pool({
  host: 'localhost',
  user: 'jordanabbasi',
  database: 'questions_and_answers',
});

app.get('/qa/questions', async (req, res) => {
  const { product_id } = req.body;
  const client = await pool.connect();
  const results = await client.query('SELECT * FROM questions LIMIT 10');
  client.release();
  res.status(200).send(results);
});

app.listen(port, () => {
  console.log(`Express server listening on port: ${port}`);
});
