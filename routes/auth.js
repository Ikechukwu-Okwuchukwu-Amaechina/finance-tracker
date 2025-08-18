const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const auth = require('../middleware/auth');

dotenv.config();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, accountType, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, accountType, password });
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, balance: user.balance } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, balance: user.balance } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/me', auth, async (req, res) => {
  const user = req.user;
  res.json({ id: user._id, name: user.name, email: user.email, balance: user.balance });
});

module.exports = router;
