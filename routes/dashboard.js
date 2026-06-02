const router = require('express').Router();
const Course = require('../models/Course');
const Enquiry = require('../models/Enquiry');
const Testimonial = require('../models/Testimonial');
const GalleryItem = require('../models/GalleryItem');
const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/stats', auth, adminOnly, async (req, res, next) => {
  try {
    const [courses, enquiries, testimonials, gallery, contacts, students, recentEnquiries] =
      await Promise.all([
        Course.countDocuments(),
        Enquiry.countDocuments(),
        Testimonial.countDocuments(),
        GalleryItem.countDocuments(),
        ContactMessage.countDocuments(),
        User.countDocuments({ role: 'student' }),
        Enquiry.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      courses,
      enquiries,
      testimonials,
      gallery,
      contacts,
      students,
      recentEnquiries,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
