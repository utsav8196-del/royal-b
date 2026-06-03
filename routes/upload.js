const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { upload, uploadsDir } = require('../middleware/upload');
const {
  isCloudinaryConfigured,
  uploadBuffer,
  cloudinaryDeliveryUrl,
} = require('../config/cloudinary');

router.post('/image', auth, adminOnly, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    if (isCloudinaryConfigured()) {
      const result = await uploadBuffer(req.file.buffer);
      return res.status(201).json({
        url: cloudinaryDeliveryUrl(result.secure_url),
        publicId: result.public_id,
        message: 'Image uploaded to Cloudinary successfully',
      });
    }

    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({
      url,
      filename: req.file.filename,
      message: 'Image uploaded successfully',
    });
  } catch (err) {
    if (req.file?.filename && !req.file.buffer) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    next(err);
  }
});

module.exports = router;
