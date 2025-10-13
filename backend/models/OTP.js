import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['login', 'register'],
    required: true
  },
  userData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 minutes
  }
});

// Index for faster queries
otpSchema.index({ email: 1, type: 1 });
// Note: TTL index is automatically created from the `expires` option on createdAt above.
// Avoid adding another TTL on createdAt to prevent duplicate index warnings.

export default mongoose.model('OTP', otpSchema);