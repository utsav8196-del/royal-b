const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  showOnHome: { type: Boolean, default: true },
  homeOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
