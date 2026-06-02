require('./config/env');

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {
  connectDatabase,
  isDatabaseConnected,
  requireDatabase,
  printAtlasHelp,
} = require('./config/db');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const testimonialRoutes = require('./routes/testimonials');
const teamRoutes = require('./routes/team');
const galleryRoutes = require('./routes/gallery');
const blogRoutes = require('./routes/blog');
const enquiryRoutes = require('./routes/enquiries');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');
const dashboardRoutes = require('./routes/dashboard');
const uploadRoutes = require('./routes/upload');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  const dbOk = isDatabaseConnected();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'disconnected',
    api: 'running',
  });
});

app.use('/api/upload', uploadRoutes);
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/courses', requireDatabase, courseRoutes);
app.use('/api/testimonials', requireDatabase, testimonialRoutes);
app.use('/api/team', requireDatabase, teamRoutes);
app.use('/api/gallery', requireDatabase, galleryRoutes);
app.use('/api/blog', requireDatabase, blogRoutes);
app.use('/api/enquiries', requireDatabase, enquiryRoutes);
app.use('/api/contact', requireDatabase, contactRoutes);
app.use('/api/settings', requireDatabase, settingsRoutes);
app.use('/api/dashboard', requireDatabase, dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in server/.env — copy server/.env.example and configure MongoDB.');
  process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change_this')) {
  console.warn('Warning: Set a strong JWT_SECRET in server/.env for production.');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${PORT}/api`);
  console.log(`Health: http://localhost:${PORT}/api/health`);

  connectDatabase().catch((err) => {
    console.error('MongoDB connection error:', err.message);
    printAtlasHelp();
    console.error('Server is running but API routes need the database. Fix Atlas, then type rs in nodemon.\n');
  });
});
