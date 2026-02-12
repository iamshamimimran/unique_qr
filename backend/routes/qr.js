import express from 'express';
import QR from '../models/QR.js';
import auth from '../middleware/auth.js';

const router = express.Router();


// Save a new QR
router.post('/', auth, async (req, res) => {
  try {
    const { content, type, style } = req.body;
    const user = req.user; // Attached by middleware

    // Check limit for free users
    if (user.subscriptionStatus === 'free' && user.qrCount >= 5) {
      return res.status(403).json({ message: 'Free limit reached. Please upgrade to Pro.' });
    }

    const newQR = new QR({
      userId: req.userId,
      content,
      type,
      style,
    });

    await newQR.save();
    
    // Increment count for free users
    if (user.subscriptionStatus === 'free') {
      user.qrCount += 1;
      await user.save();
    }

    res.status(201).json(newQR);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving QR' });
  }
});

// Get user's QR history
router.get('/', auth, async (req, res) => {
  try {
    const qrs = await QR.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(qrs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching QR history' });
  }
});

// Delete a QR from history
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const qr = await QR.findOneAndDelete({ _id: id, userId: req.userId });
        if (!qr) return res.status(404).json({ message: 'QR not found' });
        res.status(200).json({ message: 'QR deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting QR' });
    }
});

export default router;
