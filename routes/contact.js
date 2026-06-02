const router = require('express').Router();
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validateBody } = require('../middleware/validate');

router.post(
  '/',
  validateBody({
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    subject: { required: true, minLength: 3 },
    message: { required: true, minLength: 10 },
  }),
  async (req, res, next) => {
    try {
      const msg = await ContactMessage.create(req.body);
      res.status(201).json({ message: 'Message sent successfully', id: msg._id });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', auth, adminOnly, async (req, res, next) => {
  try {
    res.json(await ContactMessage.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json(msg);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
