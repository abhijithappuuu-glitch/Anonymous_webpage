import mongoose from 'mongoose';

const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('GalleryImage', GalleryImageSchema);