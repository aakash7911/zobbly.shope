import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();

// Email Transporter (Configured for Brevo / Any SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Register & Send OTP
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

    if (!user) {
      user = new User({ name, email, password: hashedPassword, otp, otpExpires });
    } else {
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Send OTP via Brevo
    await transporter.sendMail({
      from: `"Zobbly Shope" <no-reply@zobbly.shope>`,
      to: email,
      subject: 'Verify your Zobbly Account',
      html: `<h2>Welcome to Zobbly!</h2><p>Your OTP for registration is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
    });

    res.status(200).json({ message: 'OTP sent to email successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 3. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid credentials or user not verified' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 4. Update Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, location } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.location = location || user.location;
    await user.save();

    res.status(200).json({ 
      message: 'Profile updated', 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
