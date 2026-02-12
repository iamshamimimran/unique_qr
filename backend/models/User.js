import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
  qrCount: {
    type: Number,
    default: 0,
  },
  subscriptionExpires: {
    type: Date,
    default: null,
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
