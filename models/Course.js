const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: String,
  description: String,
  image: String,
  duration: String,
  fee: String,
  curriculum: [{ title: String, topics: [String] }],
  instructor: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  featured: { type: Boolean, default: false },
  homeOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);