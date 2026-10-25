const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas or local MongoDB instance with Mongoose
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const errorMsg = 'CRITICAL: MONGODB_URI environment variable is missing in backend/.env';
    console.error(`[Database Error] ${errorMsg}`);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    }
    return false;
  }

  try {
    const options = {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(uri, options);
    // Sanitize host output so password/credentials are never printed
    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`[Database Connection Error] Could not connect to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return false;
  }
};

module.exports = connectDB;
