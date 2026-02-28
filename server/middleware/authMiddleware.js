const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No Firebase token provided.' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.firebaseUser = decodedToken;
    req.user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (!req.user && req.path !== '/sync') {
      return res.status(404).json({ message: 'User profile not found. Please sync your profile first.' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: invalid Firebase token.' });
  }
};

module.exports = {
  protect,
};
