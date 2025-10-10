import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['Workshop', 'Hackathon', 'Webinar', 'Conference', 'Other'],
    default: 'Other'
  },
  summary: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['upcoming', 'past'],
    default: 'upcoming'
  }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
