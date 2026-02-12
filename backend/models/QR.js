import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'url', 'wifi', 'vcard', 'email'],
  },
  style: {
    styleType: String,
    eyeStyle: String,
    fgColor: String,
    bgColor: String,
    gradient: {
      active: Boolean,
      start: String,
      end: String,
    },
    logo: String,
    logoBgColor: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QR = mongoose.model('QR', qrSchema);
export default QR;
