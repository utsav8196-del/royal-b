function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      if (rules.required && (value === undefined || value === null || String(value).trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      if (value === undefined || value === null || value === '') continue;
      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        errors.push(`${field} must be a valid email`);
      }
      if (rules.minLength && String(value).length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength && String(value).length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }
    }
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    next();
  };
}

module.exports = { validateBody };
