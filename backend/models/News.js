import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Global', 'Indian'],
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  publishedAt: {
    type: Date,
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
newsSchema.index({ weekNumber: 1, year: 1, category: 1 });
newsSchema.index({ createdAt: -1 });

const News = mongoose.model('News', newsSchema);

export default News;
