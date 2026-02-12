import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthenticated' });

    const token = authHeader.split(' ')[1];
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if subscription expired
    if (user.subscriptionStatus === 'pro' && user.subscriptionExpires && user.subscriptionExpires < new Date()) {
      user.subscriptionStatus = 'free';
      await user.save();
    }

    req.userId = user._id;
    req.user = user; // Attach user object for convenience
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
