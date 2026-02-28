const express = require('express');
const { postAnswer, getAnswersByDoubt, upvoteAnswer } = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/doubt/:doubtId', getAnswersByDoubt);
router.post('/doubt/:doubtId', protect, postAnswer);
router.post('/:answerId/upvote', protect, upvoteAnswer);

module.exports = router;
