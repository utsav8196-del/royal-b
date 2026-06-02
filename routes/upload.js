const router = require('express').Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { upload } = require('../middleware/upload');

router.post('/image', auth, adminOnly, upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const baseUrl = process.env.API_PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    res.status(201).json({
      url,
      filename: req.file.filename,
      message: 'Image uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
