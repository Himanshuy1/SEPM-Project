const express = require('express');
const { getChatHistory, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/history/:otherUserId', protect, getChatHistory);
router.get('/conversations', protect, getConversations);

module.exports = router;
