const router = require('express').Router();
const Enquiry = require('../models/Enquiry');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validateBody } = require('../middleware/validate');

router.post(
  '/',
  validateBody({
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    phone: { required: true, minLength: 10 },
  }),
  async (req, res, next) => {
    try {
      const enquiry = await Enquiry.create(req.body);
      res.status(201).json({ message: 'Enquiry submitted successfully', id: enquiry._id });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', auth, adminOnly, async (req, res, next) => {
  try {
    res.json(await Enquiry.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    res.json(enquiry);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
