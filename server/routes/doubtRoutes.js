const express = require('express');
const { createDoubt, getAllDoubts, getDoubtById } = require('../controllers/doubtController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllDoubts);
router.get('/:id', getDoubtById);
router.post('/', protect, createDoubt);

module.exports = router;
