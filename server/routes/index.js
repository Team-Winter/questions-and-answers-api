const express = require('express');
const router = express.Router();
const { questions, answers } = require('../controllers');

router.get('/questions', questions.get);

router.get('/questions/:question_id/answers', answers.get);

router.post('/questions', questions.post);

router.post('/questions/:question_id/answers', answers.post);

router.put('/questions/:question_id/helpful', questions.helpful);

router.put('/questions/:question_id/report', questions.report);

router.put('/answers/:answer_id/helpful', answers.helpful);

router.put('/answers/:answer_id/report', answers.report);

module.exports = router;
