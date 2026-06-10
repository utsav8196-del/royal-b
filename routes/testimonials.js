const router = require('express').Router();
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validateBody } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const items = await Testimonial.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/home', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 20);
    let items = await Testimonial.find({ status: 'active', showOnHome: true })
      .sort({ homeOrder: 1, createdAt: -1 })
      .limit(limit);
    if (items.length === 0) {
      items = await Testimonial.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(limit);
    }
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/manage/all', auth, adminOnly, async (req, res, next) => {
  try {
    res.json(await Testimonial.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  adminOnly,
  validateBody({ name: { required: true }, message: { required: true, minLength: 10 } }),
  async (req, res, next) => {
    try {
      const item = await Testimonial.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/student',
  auth,
  validateBody({ message: { required: true, minLength: 10 } }),
  async (req, res, next) => {
    try {
      const item = await Testimonial.create({
        name: req.user.name,
        role: 'Student',
        message: req.body.message,
        rating: req.body.rating,
        image: req.body.image || '/default-profile.jpg',
        status: 'active',
        showOnHome: true,
      });
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
