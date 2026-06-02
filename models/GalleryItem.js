const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: String,
  url: { type: String, required: true },
  category: { type: String, default: 'general' },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', gallerySchema);
