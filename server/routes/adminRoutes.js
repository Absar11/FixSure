const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin Register (Temporary for setup)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username: username.toLowerCase(),
      password: hashedPassword
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, secretKey } = req.body;
  if (secretKey !== 'FIXSURE_SECRET_2026') {
    return res.status(403).json({ message: 'Invalid Secret Key' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      console.log('No admin found for username:', username);
      console.log('No admin found for username:', username);
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const payload = { admin: { id: admin.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
