const router = require('express').Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const DEFAULTS = {
  siteName: 'Royal Academy',
  tagline: 'Empowering students since 2008',
  phone: '+91 9876543210',
  email: 'info@royalacademy.com',
  address: 'Near Shanti Multispeciality Hospital, Triveni Society, Rajkot, Gujarat',
  heroTitle: 'Empower Your Future with Royal Academy',
  heroSubtitle: 'Expert faculty, modern labs, and proven results in Rajkot.',
  popularCoursesTitle: 'Popular Courses',
  testimonialsTitle: 'What Our Students Say',
  popularCoursesLimit: 4,
  testimonialsLimit: 10,
  logoUrl: '/logo.png',
  justDialUrl:
    'https://www.justdial.com/Rajkot/Royal-Academy-Near-Shanti-Multispeciality-Hospital-Triveni-Society/0281PX281-X281-220715102554-P1X7_BZDET',
  stats: { students: 5000, courses: 50, years: 15, successRate: 98 },
};

async function getSettingsMap() {
  const rows = await SiteSettings.find();
  const map = { ...DEFAULTS };
  rows.forEach((row) => {
    map[row.key] = row.value;
  });
  return map;
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await getSettingsMap());
  } catch (err) {
    next(err);
  }
});

router.put('/', auth, adminOnly, async (req, res, next) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await SiteSettings.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    }
    res.json(await getSettingsMap());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
