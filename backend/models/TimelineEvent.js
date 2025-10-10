import mongoose from 'mongoose';

const TimelineEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TimelineEvent', TimelineEventSchema);