const express = require('express');
const { syncUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/sync', protect, syncUser);

module.exports = router;
