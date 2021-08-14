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
  database: 'qa',
});

app.get('/qa/questions', async (req, res) => {
  let client;
  let { product_id, count, page } = req.query;
  if (count === undefined) {
    count = 5;
  }
  if (page === undefined) {
    page = 1;
  }
  const offset = (page - 1) * count;
  try {
    client = await pool.connect();
    const query = `
    SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, (
      SELECT coalesce(json_object_agg(answer.id, answer), '{}')
      FROM (
        SELECT id, body, date, answerer_name, helpfulness, (
          SELECT coalesce(json_agg(url), '[]')
          FROM photos
          WHERE answer_id = answers.id
        ) photos
        FROM answers
        WHERE question_id = q.question_id
      ) answer
    ) answers
    FROM questions AS q
    WHERE product_id=$1 AND reported=false
    OFFSET $2 ROWS
    FETCH FIRST $3 ROWS ONLY`;
    const results = await client.query(query, [product_id, offset, count]);
    const response = {
      product_id,
      results: results.rows,
    }
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
});

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  const { question_id } = req.params;
  let { count, page } = req.query;
  if (count === undefined) {
    count = 5;
  }
  if (page === undefined) {
    page = 1;
  }
  const offset = (page - 1) * count;
  let client;
  try {
    client = await pool.connect();
    const query = `
    SELECT id answer_id, body, date, answerer_name, helpfulness, (
      SELECT coalesce(json_agg(url), '[]')
      FROM photos
      WHERE answer_id = answers.id
    ) photos
    FROM answers
    WHERE question_id=$1 AND reported=false
    OFFSET $2 ROWS
    FETCH FIRST $3 ROWS ONLY`;
    const results = await client.query(query, [question_id, offset, count]);
    const response = {
      question: question_id,
      page,
      count,
      results: results.rows,
    }
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
})

app.listen(port, () => {
  console.log(`Express server listening on port: ${port}`);
});
