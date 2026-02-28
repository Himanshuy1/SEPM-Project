const User = require('../models/User');

const syncUser = async (req, res, next) => {
  try {
    const { uid, email } = req.firebaseUser;

    if (!uid || !email) {
      return res.status(400).json({ message: 'Invalid Firebase user payload.' });
    }

    let user = req.user;

    if (!user) {
      const { role, branch, semester } = req.body;

      user = await User.create({
        firebaseUID: uid,
        email,
        role: role || 'student',
        branch: branch || '',
        semester: semester || 1,
      });
    } else {
      const updates = {};
      const allowedFields = ['role', 'branch', 'semester'];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updates, { new: true, runValidators: true });
      }
    }

    return res.status(200).json({
      message: 'User synced successfully.',
      user,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  syncUser,
};
