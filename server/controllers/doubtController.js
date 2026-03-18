const mongoose = require('mongoose');
const Doubt = require('../models/Doubt');

const createDoubt = async (req, res, next) => {
  try {
    const { title, description, subject, semester } = req.body;

    if (!title || !description || !subject || !semester) {
      return res.status(400).json({ message: 'title, description, subject, and semester are required.' });
    }

    const doubt = await Doubt.create({
      title,
      description,
      subject,
      semester,
      createdBy: req.user._id,
    });

    return res.status(201).json(doubt);
  } catch (error) {
    return next(error);
  }
};

const getAllDoubts = async (req, res, next) => {
  try {
    const { subject, semester, title } = req.query;
    const filter = {};

    if (subject) {
      filter.subject = subject;
    }

    if (semester) {
      filter.semester = Number(semester);
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    const doubts = await Doubt.find(filter)
      .populate('createdBy', 'email role branch semester reputation firebaseUID')
      .sort({ createdAt: -1 });

    return res.status(200).json(doubts);
  } catch (error) {
    return next(error);
  }
};

const getDoubtById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid doubt ID.' });
    }

    const doubt = await Doubt.findById(id).populate('createdBy', 'email role branch semester reputation firebaseUID');

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found.' });
    }

    return res.status(200).json(doubt);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDoubt,
  getAllDoubts,
  getDoubtById,
};
