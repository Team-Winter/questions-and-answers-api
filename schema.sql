-- notes to self:
-- must have answers.csv, questions.csv, answers_photos.csv downloaded (might have to adjust the absolute paths seen on lines 22, 41, 55)
-- to run this, first create a database using createdb
-- eg 'createdb questions_and_answers'
-- then: 'psql questions_and_answers'
-- then: '\i schema.sql'

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id              serial primary key,
  body            text                  not null,
  date            bigint                not null,
  asker_name      text                  not null,
  asker_email     text                  not null,
  helpfulness     integer               not null default 0,
  reported        boolean               not null default false,
  product_id      integer               not null
);

COPY questions (id, product_id, body, date, asker_name, asker_email, reported, helpfulness)
FROM '/Users/jordanabbasi/HR/questions-and-answers-api/questions.csv'
DELIMITER ','
CSV
HEADER;

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  id                 serial primary key,
  question_id        integer references questions    not null,
  body               text                            not null,
  date               bigint                          not null,
  answerer_name      text                            not null,
  answerer_email     text                            not null,
  reported           boolean                         not null default false,
  helpfulness        integer                         not null default 0
);

COPY answers
FROM '/Users/jordanabbasi/HR/questions-and-answers-api/answers.csv'
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
FROM '/Users/jordanabbasi/HR/questions-and-answers-api/answers_photos.csv'
DELIMITER ','
CSV
HEADER;
