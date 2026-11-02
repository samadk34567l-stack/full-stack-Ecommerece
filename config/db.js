const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS servers cannot be overridden
}

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  let rawUri = String(process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
  rawUri = rawUri
    .replace(/^(MONGO_URI|MONGODB_URI)\s*=\s*/i, '')
    .replace(/^["']|["']$/g, '')
    .trim();

  if (!rawUri) {
    throw new Error('MONGO_URI environment variable set nahi hai');
  }

  connectionPromise = mongoose
    .connect(rawUri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then((conn) => {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((error) => {
      connectionPromise = null;
      console.error(`❌ MongoDB connection error: ${error.message}`);
      throw error;
    });

  return connectionPromise;
};

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
