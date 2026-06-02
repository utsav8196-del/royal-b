const router = require('express').Router();
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validateBody } = require('../middleware/validate');

router.get('/', async (req, res, next) => {
  try {
    const members = await TeamMember.find({ status: 'active' }).sort({ order: 1 });
    res.json(members);
  } catch (err) {
    next(err);
  }
});

router.get('/manage/all', auth, adminOnly, async (req, res, next) => {
  try {
    res.json(await TeamMember.find().sort({ order: 1 }));
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  adminOnly,
  validateBody({ name: { required: true }, role: { required: true } }),
  async (req, res, next) => {
    try {
      res.status(201).json(await TeamMember.create(req.body));
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
