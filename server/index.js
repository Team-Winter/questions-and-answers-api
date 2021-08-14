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
    const query = `select q.id question_id, q.body question_body, q.date question_date, q.asker_name, q.helpfulness question_helpfulness, q.reported, (
      coalesce(
        (select json_object_agg(answer.id, answer)
        from (
          select id, body, date, answerer_name, helpfulness from answers where question_id = q.id
        ) answer),
        '{}'
      )
    ) answers
    from questions as q where q.product_id=$1
    offset $2 rows
    fetch first $3 rows only`;
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

app.listen(port, () => {
  console.log(`Express server listening on port: ${port}`);
});
