module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image must be smaller than 5MB' });
  }
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate entry' });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};
