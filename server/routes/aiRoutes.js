const express = require('express');
const router = express.Router();
const { summarizeText, chatWithAI, summarizeFile } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../controllers/resourceController');

// All AI routes are protected
router.post('/summarize', protect, summarizeText);
router.post('/summarize-file', protect, upload.single('file'), summarizeFile);
router.post('/chat', protect, chatWithAI);

module.exports = router;
