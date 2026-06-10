const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
});

router.post(
  '/register',
  validateBody({
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, minLength: 6 },
  }),
  async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body;
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered. Please log in.' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashed,
        phone,
        role: 'student',
      });
      const token = signToken(user);
      res.status(201).json({ token, user: userResponse(user) });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  validateBody({
    email: { required: true, email: true },
    password: { required: true, minLength: 1 },
  }),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

      const isFirstLogin = !user.hasLoggedIn;
      if (isFirstLogin) {
        user.hasLoggedIn = true;
        await user.save();
      }

      const token = signToken(user);
      res.json({ token, user: userResponse(user), isFirstLogin });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(userResponse(user));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
