const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

let initialized = false;

try {
  // 👉 Path priority:
  // 1. ENV variable
  // 2. Default local file
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, "../firebase-service-account.json");

  const serviceAccount = require(path.resolve(serviceAccountPath));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
  console.log("✅ Firebase Admin initialized using service account");

} catch (error) {
  console.warn(
    "⚠ Firebase service account not found. Trying default credentials..."
  );

  // 👉 Fallback to Google credentials (useful in cloud/deployment)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      admin.initializeApp();
      initialized = true;
      console.log("✅ Firebase Admin initialized using default credentials");
    } catch (err) {
      console.error("❌ Firebase Admin fallback initialization failed:", err.message);
    }
  }
}

if (!initialized) {
  console.warn("🚨 Firebase Admin NOT initialized — auth features disabled.");
}

module.exports = admin;
