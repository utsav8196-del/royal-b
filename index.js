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

function normalizeOrigin(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function buildAllowedOrigins() {
  const fromEnv = (process.env.CLIENT_URL || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

  const defaults = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://royal-five-neon.vercel.app',
  ];

  return new Set([...defaults, ...fromEnv.map(normalizeOrigin)]);
}

const allowedOrigins = buildAllowedOrigins();

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // Allow non-browser clients / same-origin requests
      if (!origin) return callback(null, true);

      const cleaned = normalizeOrigin(origin);
      if (allowedOrigins.has(cleaned)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
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
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (mongoUri && !process.env.MONGO_URI) {
  process.env.MONGO_URI = mongoUri;
}

if (!mongoUri) {
  console.error(
    'Missing database URI. Set MONGO_URI (or MONGODB_URI / DATABASE_URL) in Render Environment variables.'
  );
  process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change_this')) {
  console.warn('Warning: Set a strong JWT_SECRET in Render Environment variables for production.');
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
