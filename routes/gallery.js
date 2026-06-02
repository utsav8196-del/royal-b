const router = require('express').Router();
const GalleryItem = require('../models/GalleryItem');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validateBody } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const items = await GalleryItem.find({ status: 'active' }).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/manage/all', auth, adminOnly, async (req, res, next) => {
  try {
    res.json(await GalleryItem.find().sort({ order: 1 }));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  adminOnly,
  validateBody({ url: { required: true } }),
  async (req, res, next) => {
    try {
      res.status(201).json(await GalleryItem.create(req.body));
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
