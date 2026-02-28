const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const Resource = require('../models/Resource');

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadResource = async (req, res, next) => {
  try {
    const { title, subject, semester, description, externalLink } = req.body;

    if (!title || !subject || !semester) {
      return res.status(400).json({ message: 'title, subject, and semester are required.' });
    }

    if (!req.file && !externalLink) {
      return res.status(400).json({ message: 'Either a file upload or an external link is required.' });
    }

    const resourceData = {
      title,
      subject,
      semester,
      description: description || '',
      uploadedBy: req.user._id,
    };

    if (req.file) {
      resourceData.filePath = `uploads/${req.file.filename}`;
    } else {
      resourceData.externalLink = externalLink;
    }

    const resource = await Resource.create(resourceData);

    return res.status(201).json(resource);
  } catch (error) {
    return next(error);
  }
};

const upvoteResource = async (req, res, next) => {
  try {
    const { resourceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ message: 'Invalid resource ID.' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    const voterId = req.user._id;
    const alreadyUpvoted = resource.upvotes.some((id) => id.equals(voterId));

    if (!alreadyUpvoted) {
      resource.upvotes.push(voterId);
      await resource.save();
    }

    return res.status(200).json({
      message: alreadyUpvoted ? 'Already upvoted.' : 'Upvote added.',
      upvotesCount: resource.upvotes.length,
      resource,
    });
  } catch (error) {
    return next(error);
  }
};

const getResources = async (req, res, next) => {
  try {
    const { subject, semester } = req.query;
    const filter = {};

    if (subject) {
      filter.subject = subject;
    }

    if (semester) {
      filter.semester = Number(semester);
    }

    const resources = await Resource.find(filter)
      .populate('uploadedBy', 'email role branch semester reputation')
      .sort({ createdAt: -1 });

    return res.status(200).json(resources);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  upload,
  uploadResource,
  upvoteResource,
  getResources,
};
