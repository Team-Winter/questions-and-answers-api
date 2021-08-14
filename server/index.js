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
  try {
    const { product_id } = req.query;
    client = await pool.connect();
    const query = `select q.id question_id, q.body question_body, q.date question_date, q.asker_name, q.helpfulness question_helpfulness, q.reported, (
      select json_agg(ans)
      from (
        select * from answers where question_id = q.id
      ) ans
    ) answers
    from questions as q where q.product_id=$1`;
    const results = await client.query(query, [product_id]);
    const response = {
      product_id,
      results: results.rows,
    }
    console.log(response);
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
