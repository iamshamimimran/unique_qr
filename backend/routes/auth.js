import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: user._id, email: user.email, subscriptionStatus: user.subscriptionStatus });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, userId: user._id, email: user.email, subscriptionStatus: user.subscriptionStatus });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Middleware already handled expiration check and attached user to req
    res.status(200).json(req.user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Increment QR Count
router.post('/increment-qr', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.subscriptionStatus === 'free' && user.qrCount >= 5) {
      return res.status(403).json({ message: 'Free limit reached. Please upgrade to Pro.' });
    }

    user.qrCount += 1;
    await user.save();

    res.status(200).json({ qrCount: user.qrCount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating QR count' });
  }
});

export default router;
