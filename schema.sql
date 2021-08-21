-- notes to self:
-- must have answers.csv, questions.csv, answers_photos.csv downloaded (might have to adjust the absolute paths seen on lines 22, 41, 55)
-- to run this, first create a database using createdb
-- eg 'createdb questions_and_answers'
-- then: 'psql questions_and_answers'
-- then: '\i schema.sql'

DROP TABLE IF EXISTS questions CASCADE;

CREATE TABLE questions (
  question_id              serial primary key,
  question_body            text                  not null,
  question_date            bigint                not null,
  asker_name      text                  not null,
  asker_email     text                  not null,
  question_helpfulness     integer               not null default 0,
  reported        boolean               not null default false,
  product_id      integer               not null
);

COPY questions (question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
FROM 'home/Ubuntu/questions.csv'
-- FROM '/Users/jordanabbasi/HR/questions-and-answers-api/questions.csv'
DELIMITER ','
CSV
HEADER;

DROP TABLE IF EXISTS answers CASCADE;

CREATE TABLE answers (
  id                 serial primary key,
  question_id        integer references questions(question_id)    not null,
  body               text                            not null,
  date               bigint                          not null,
  answerer_name      text                            not null,
  answerer_email     text                            not null,
  reported           boolean                         not null default false,
  helpfulness        integer                         not null default 0
);

COPY answers
FROM 'home/Ubuntu/answers.csv'
-- FROM '/Users/jordanabbasi/HR/questions-and-answers-api/answers.csv'
DELIMITER ','
CSV
HEADER;

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id              serial primary key,
  answer_id       integer references answers  not null,
  url             text                        not null
);

COPY photos
FROM '/home/Ubuntu/answers_photos.csv'
-- FROM '/Users/jordanabbasi/HR/questions-and-answers-api/answers_photos.csv'
DELIMITER ','
CSV
HEADER;

-- reset serial sequence after import!
SELECT pg_catalog.setval(pg_get_serial_sequence('questions', 'question_id'), (SELECT MAX(question_id) FROM questions));
SELECT pg_catalog.setval(pg_get_serial_sequence('answers', 'id'), (SELECT MAX(id) FROM answers));
SELECT pg_catalog.setval(pg_get_serial_sequence('photos', 'id'), (SELECT MAX(id) FROM photos));

-- try with and without indices:
CREATE INDEX idx_questions_product_id ON questions(product_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_photos_answer_id ON photos(answer_id);
