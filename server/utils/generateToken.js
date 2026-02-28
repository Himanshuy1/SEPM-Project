const admin = require('../config/firebase');

const generateFirebaseCustomToken = async (uid, claims = {}) => {
  if (!uid) {
    throw new Error('uid is required to generate a Firebase custom token.');
  }

  return admin.auth().createCustomToken(uid, claims);
};

module.exports = generateFirebaseCustomToken;
