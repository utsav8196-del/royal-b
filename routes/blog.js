const router = require('express').Router();
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validateBody } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get('/slug/:slug', async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.get('/manage/all', auth, adminOnly, async (req, res, next) => {
  try {
    res.json(await BlogPost.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  adminOnly,
  validateBody({
    title: { required: true, minLength: 3 },
    slug: { required: true, minLength: 3 },
    content: { required: true, minLength: 20 },
  }),
  async (req, res, next) => {
    try {
      res.status(201).json(await BlogPost.create(req.body));
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
