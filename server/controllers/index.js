const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost', // for local
  // host: '35.167.129.43', // for EC2
  user: 'jordanabbasi', // for local
  // user: 'ubuntu', // for EC2
  // password: 'ubuntu', // for EC2
  database: 'questions_and_answers',
});

const answers = {};
const questions = {};

questions.get = async (req, res) => {
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
        WHERE question_id = q.question_id AND reported = false
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
};

answers.get = async (req, res) => {
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
};

questions.post = async (req, res) => {
  const { body, name, email, product_id } = req.body;
  const date = Date.now();
  let client;
  try {
    client = await pool.connect();
    const query = `
    INSERT INTO questions (question_body, asker_name, asker_email, product_id, question_date)
    VALUES ($1, $2, $3, $4, $5)`;
    const results = await client.query(query, [body, name, email, product_id, date]);
    res.status(200).send('Created');
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
};

answers.post = async (req, res) => {
  const { question_id } = req.params;
  let { body, name, email, photos } = req.body;
  photos = photos || [];
  const date = Date.now();
  let client;
  try {
    client = await pool.connect();
    let query = `
      INSERT INTO answers (body, answerer_name, answerer_email, question_id, date)
      VALUES ($1, $2, $3, $4, $5)`;
    if (photos && photos.length) {
      query = `WITH inserted_id AS (
       ${query}
       RETURNING id
      )
      INSERT INTO photos (answer_id, url) VALUES
      ${photos.map((_, i) => `((SELECT id FROM inserted_id), $${i + 6})`).join(', ')}
    `;
    }
    const results = await client.query(query, [body, name, email, question_id, date, ...photos]);
    res.status(200).send('Created');
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
};

questions.helpful = async (req, res) => {
  const { question_id } = req.params;
  let client;
  try {
    client = await pool.connect();
    let query = `
      UPDATE questions
      SET question_helpfulness = question_helpfulness + 1
      WHERE question_id = $1
    `;
    const results = await client.query(query, [question_id]);
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
};

questions.report = async (req, res) => {
  const { question_id } = req.params;
  let client;
  try {
    client = await pool.connect();
    let query = `
      UPDATE questions
      SET reported = true
      WHERE question_id = $1
    `;
    const results = await client.query(query, [question_id]);
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
};

answers.helpful = async (req, res) => {
  const { answer_id } = req.params;
  let client;
  try {
    client = await pool.connect();
    let query = `
      UPDATE answers
      SET helpfulness = helpfulness + 1
      WHERE id = $1
    `;
    const results = await client.query(query, [answer_id]);
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
};

answers.report = async (req, res) => {
  const { answer_id } = req.params;
  let client;
  try {
    client = await pool.connect();
    let query = `
      UPDATE answers
      SET reported = true
      WHERE id = $1
    `;
    const results = await client.query(query, [answer_id]);
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  } finally {
    client.release();
  }
}

module.exports = {
  questions,
  answers
}