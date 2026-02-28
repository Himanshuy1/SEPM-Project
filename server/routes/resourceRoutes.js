const express = require('express');
const { upload, uploadResource, upvoteResource, getResources } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getResources);
router.post('/', protect, upload.single('file'), uploadResource);
router.post('/:resourceId/upvote', protect, upvoteResource);

module.exports = router;
