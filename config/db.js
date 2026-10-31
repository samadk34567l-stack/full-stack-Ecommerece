const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS servers cannot be overridden
}

const connectDB = async () => {
  try {
    let rawUri = String(process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
    rawUri = rawUri.replace(/^(MONGO_URI|MONGODB_URI)\s*=\s*/i, '').replace(/^["']|["']$/g, '').trim();
    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas connection warning: ${error.message}`);
    console.warn(`👉 Tip: MongoDB Atlas -> Network Access -> Add IP Address -> "Allow Access from Anywhere" (0.0.0.0/0) karein.`);
    console.log(`✅ Server fallback memory mode mein chal raha hai taake API kabhi band na ho!`);
    return false;
  }
};

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
