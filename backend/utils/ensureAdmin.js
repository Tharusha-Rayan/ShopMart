const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin1@shophub.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Store Admin';

const ensureAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      if (existingAdmin.role !== 'admin' || existingAdmin.isBanned) {
        existingAdmin.role = 'admin';
        existingAdmin.isBanned = false;
        existingAdmin.banReason = undefined;
        await existingAdmin.save();
        console.log(`Updated existing account as active admin: ${ADMIN_EMAIL}`);
      } else {
        console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      }
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isEmailVerified: true,
        isBanned: false
      });
      console.log(`Admin created: ${ADMIN_EMAIL}`);
    }

    console.log(`Credentials: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to ensure admin account:', error.message);
    process.exit(1);
  }
};

ensureAdmin();
