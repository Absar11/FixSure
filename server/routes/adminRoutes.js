const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin Register with Secret Key
router.post('/register', async (req, res) => {
  const { username, password, secretKey } = req.body;
  
  if (secretKey !== 'FIXSURE_SECRET_2026') {
    return res.status(403).json({ message: 'Invalid Secret Key' });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username: username.toLowerCase(),
      password: hashedPassword
    });

    await newAdmin.save();
    console.log('New Admin Registered:', username);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Error registering admin' });
  }
});

// Admin Password Reset with Secret Key
router.post('/reset-password', async (req, res) => {
  const { username, password, secretKey } = req.body;
  if (secretKey !== 'FIXSURE_SECRET_2026') {
    return res.status(403).json({ message: 'Invalid Secret Key' });
  }
  try {
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;
    await admin.save();
    console.log('Admin Password Reset for:', username);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('--- Login Attempt ---');
  console.log('Username provided:', username);

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  try {
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      console.log('Login failed: Admin not found in DB for -', username);
      return res.status(400).json({ message: 'Invalid Username or Password' });
    }

    const isMatch = await bcrypt.compare(password.trim(), admin.password);
    console.log('Bcrypt Match Result:', isMatch);

    if (!isMatch) {
      console.log('Login failed: Password mismatch for -', username);
      return res.status(400).json({ message: 'Invalid Username or Password' });
    }

    const token = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_SECRET || 'secret123', 
      { expiresIn: '24h' }
    );

    console.log('Admin logged in successfully:', username);
    res.json({ token });
  } catch (error) {
    console.error('SERVER LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
