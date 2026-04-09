const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const isDnsIssue =
      error &&
      (error.code === 'ENOTFOUND' ||
        (typeof error.message === 'string' && error.message.includes('querySrv ENOTFOUND')));

    if (isDnsIssue) {
      const hint =
        'MongoDB DNS lookup failed. Check MONGODB_URI host in backend/.env and verify Atlas cluster hostname exists.';
      logger.error(`MongoDB Connection Error: ${error.message}. ${hint}`);
      console.error(`MongoDB Connection Error: ${error.message}`);
      console.error(hint);
    } else {
      logger.error(`MongoDB Connection Error: ${error.message}`);
      console.error(`MongoDB Connection Error: ${error.message}`);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
