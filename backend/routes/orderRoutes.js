import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// 1. Create Razorpay Order
router.post('/create', async (req, res) => {
  try {
    const { amount, userId, products, shippingAddress } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save initial order as Pending
    const newOrder = new Order({
      user: userId,
      products,
      totalAmount: amount,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      status: 'Pending',
      isPaid: false
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      order: newOrder,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
});

// 2. Verify Payment
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = req.body;

    // Verify Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful
      const order = await Order.findById(db_order_id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.razorpayPaymentId = razorpay_payment_id;
        order.status = 'Processing'; // Update status to Processing after payment
        await order.save();
      }
      return res.status(200).json({ message: 'Payment verified successfully', success: true });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!', success: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

// 3. Get User Orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('products.product', 'name image price brand')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

export default router;
