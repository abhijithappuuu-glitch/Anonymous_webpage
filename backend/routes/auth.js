import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import emailService from '../services/emailService.js';

const router = express.Router();

let warnedExpire = false;
const generateToken = (id) => {
  const expires = process.env.JWT_EXPIRE || '7d';
  if (!process.env.JWT_EXPIRE && !warnedExpire) {
    console.warn('[auth] JWT_EXPIRE not set, defaulting to 7d');
    warnedExpire = true;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expires });
};

// Generate unique 6-digit OTP with crypto randomness
const generateOTP = () => {
  // Use crypto for better randomness and ensure uniqueness
  const timestamp = Date.now().toString().slice(-3); // Last 3 digits of timestamp
  const random = crypto.randomInt(100, 999); // 3 secure random digits
  const otp = (timestamp + random).toString();
  
  // Ensure exactly 6 digits
  return otp.padStart(6, '0');
};

// Register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for:', email, 'Role:', user.role);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send OTP for registration
router.post('/send-register-otp', [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Remove any existing OTPs for this email
    await OTP.deleteMany({ email, type: 'register' });

    // Create new OTP record
    await OTP.create({
      email,
      otp,
      type: 'register',
      userData: { username, email, password }
    });

    // Send OTP via email
    await emailService.sendOTP(email, otp, 'register');

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Send register OTP error:', error);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
});

// Send OTP for login
router.post('/send-login-otp', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'No account found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Remove any existing OTPs for this email
    await OTP.deleteMany({ email, type: 'login' });

    // Create new OTP record
    await OTP.create({
      email,
      otp,
      type: 'login',
      userData: { email }
    });

    // Send OTP via email
    await emailService.sendOTP(email, otp, 'login');

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
});

// Verify OTP and complete authentication
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('isRegistration').isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, otp, isRegistration } = req.body;
    const type = isRegistration ? 'register' : 'login';

    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      email, 
      type, 
      verified: false 
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'Too many failed attempts. Please request a new code.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    let user;

    if (isRegistration) {
      // Create new user
      const { username, password } = otpRecord.userData;
      user = await User.create({ username, email, password });
    } else {
      // Find existing user for login
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
    }

    // Clean up OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Return user data with token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', [
  body('email').isEmail().normalizeEmail(),
  body('isRegistration').isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, isRegistration } = req.body;
    const type = isRegistration ? 'register' : 'login';

    // Find existing OTP record to get userData
    const existingOtp = await OTP.findOne({ 
      email, 
      type 
    }).sort({ createdAt: -1 });

    if (!existingOtp) {
      return res.status(400).json({ message: 'No pending verification found. Please start the process again.' });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Remove old OTPs
    await OTP.deleteMany({ email, type });

    // Create new OTP record with same userData
    await OTP.create({
      email,
      otp,
      type,
      userData: existingOtp.userData
    });

    // Send new OTP via email
    await emailService.sendOTP(email, otp, type);

    res.json({ message: 'New verification code sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend verification code' });
  }
});

export default router;
