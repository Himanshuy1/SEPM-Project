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
    console.log("AuthMiddleware: Token verified for UID:", decodedToken.uid);

    req.firebaseUser = decodedToken;
    req.user = await User.findOne({ firebaseUID: decodedToken.uid });
    const isSyncRoute = req.path === '/sync' || req.originalUrl === '/api/auth/sync';
    console.log(`AuthMiddleware: Processing ${req.method} ${req.originalUrl}, isSyncRoute: ${isSyncRoute}`);

    if (!req.user && !isSyncRoute) {
      console.log("AuthMiddleware: User not found and NOT a sync request. Failing with 404.");
      return res.status(404).json({ message: 'User profile not found. Please sync your profile first.' });
    }

    console.log("AuthMiddleware: Proceeding to next handler.");
    return next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error.message);
    return res.status(401).json({ message: 'Unauthorized: invalid Firebase token.' });
  }
};

module.exports = {
  protect,
};
