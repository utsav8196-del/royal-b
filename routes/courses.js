const router = require('express').Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validateBody } = require('../middleware/validate');

const courseValidation = {
  title: { required: true, minLength: 2 },
  slug: { required: true, minLength: 2 },
};

router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

router.get('/popular', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 4, 12);
    let courses = await Course.find({ status: 'active', featured: true })
      .sort({ homeOrder: 1, createdAt: -1 })
      .limit(limit);
    if (courses.length === 0) {
      courses = await Course.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(limit);
    }
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

router.get('/manage/all', auth, adminOnly, async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

router.get('/manage/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
});

router.get('/slug/:slug', async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, status: 'active' });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, adminOnly, validateBody(courseValidation), async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
