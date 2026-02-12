import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create Razorpay Order
router.post('/create-order', auth, async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: 9900, // amount in the smallest currency unit (99 INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    // Save order ID to user for verification later
    await User.findByIdAndUpdate(req.userId, { razorpayOrderId: order.id });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Verify Payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      await User.findByIdAndUpdate(req.userId, {
        subscriptionStatus: 'pro',
        subscriptionExpires: expirationDate,
        razorpayOrderId: null,
      });

      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

export default router;
