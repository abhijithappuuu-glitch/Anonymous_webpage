import mongoose from 'mongoose';

const HomeContentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('HomeContent', HomeContentSchema);