const mongoose = require('mongoose');
const Answer = require('../models/Answer');
const Doubt = require('../models/Doubt');

const postAnswer = async (req, res, next) => {
  try {
    const { doubtId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doubtId)) {
      return res.status(400).json({ message: 'Invalid doubt ID.' });
    }

    if (!content) {
      return res.status(400).json({ message: 'content is required.' });
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found.' });
    }

    const answer = await Answer.create({
      doubt: doubtId,
      content,
      answeredBy: req.user._id,
    });

    return res.status(201).json(answer);
  } catch (error) {
    return next(error);
  }
};

const getAnswersByDoubt = async (req, res, next) => {
  try {
    const { doubtId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doubtId)) {
      return res.status(400).json({ message: 'Invalid doubt ID.' });
    }

    const answers = await Answer.find({ doubt: doubtId })
      .populate('answeredBy', 'email role branch semester reputation firebaseUID')
      .sort({ createdAt: -1 });

    return res.status(200).json(answers);
  } catch (error) {
    return next(error);
  }
};

const upvoteAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({ message: 'Invalid answer ID.' });
    }

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }

    const voterId = req.user._id;
    const alreadyUpvoted = answer.upvotes.some((id) => id.equals(voterId));

    if (!alreadyUpvoted) {
      answer.upvotes.push(voterId);
      await answer.save();
    }

    return res.status(200).json({
      message: alreadyUpvoted ? 'Already upvoted.' : 'Upvote added.',
      upvotesCount: answer.upvotes.length,
      answer,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  postAnswer,
  getAnswersByDoubt,
  upvoteAnswer,
};
