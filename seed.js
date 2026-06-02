const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Testimonial = require('./models/Testimonial');
const TeamMember = require('./models/TeamMember');
const GalleryItem = require('./models/GalleryItem');
const SiteSettings = require('./models/SiteSettings');
require('./config/env');
const { connectDatabase, printAtlasHelp } = require('./config/db');

async function seed() {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Testimonial.deleteMany({}),
    TeamMember.deleteMany({}),
    GalleryItem.deleteMany({}),
    SiteSettings.deleteMany({}),
  ]);

  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({
    email: 'admin@royalacademy.com',
    password: hashed,
    name: 'Admin',
    role: 'admin',
  });

  await Course.insertMany([
    {
      title: 'JEE Main & Advanced',
      slug: 'jee-main-advanced',
      category: 'jee',
      description: 'Complete preparation for JEE with expert faculty.',
      duration: '2 Years',
      fee: '₹85,000/year',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
      status: 'active',
      featured: true,
      homeOrder: 1,
    },
    {
      title: 'NEET UG Preparation',
      slug: 'neet-ug',
      category: 'neet',
      description: 'Structured NEET program with daily tests.',
      duration: '2 Years',
      fee: '₹80,000/year',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
      status: 'active',
      featured: true,
      homeOrder: 2,
    },
  ]);

  await Testimonial.insertMany([
    {
      name: 'Priya Shah',
      role: 'JEE Student',
      message: 'Royal Academy helped me secure a top rank. Faculty is outstanding!',
      rating: 5,
      status: 'active',
      showOnHome: true,
      homeOrder: 1,
    },
    {
      name: 'Rahul Mehta',
      role: 'NEET Student',
      message: 'Best coaching in Rajkot. Highly recommended.',
      rating: 5,
      status: 'active',
      showOnHome: true,
      homeOrder: 2,
    },
  ]);

  await TeamMember.insertMany([
    { name: 'Dr. Amit Patel', role: 'Physics Faculty', bio: '15+ years teaching experience', order: 1, status: 'active' },
    { name: 'Prof. Sneha Joshi', role: 'Chemistry Faculty', bio: 'IIT graduate', order: 2, status: 'active' },
  ]);

  await GalleryItem.insertMany([
    { title: 'Classroom', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', order: 1, status: 'active' },
    { title: 'Lab', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600', order: 2, status: 'active' },
  ]);

  await SiteSettings.insertMany([
    { key: 'siteName', value: 'Royal Academy' },
    { key: 'phone', value: '+91 9876543210' },
    { key: 'email', value: 'info@royalacademy.com' },
    { key: 'address', value: 'Near Shanti Multispeciality Hospital, Triveni Society, Rajkot, Gujarat' },
    { key: 'logoUrl', value: '/logo.png' },
    {
      key: 'justDialUrl',
      value:
        'https://www.justdial.com/Rajkot/Royal-Academy-Near-Shanti-Multispeciality-Hospital-Triveni-Society/0281PX281-X281-220715102554-P1X7_BZDET',
    },
    { key: 'popularCoursesTitle', value: 'Popular Courses' },
    { key: 'testimonialsTitle', value: 'What Our Students Say' },
    { key: 'popularCoursesLimit', value: 4 },
    { key: 'testimonialsLimit', value: 10 },
  ]);

  console.log('Database seeded successfully');
  console.log('Admin login: admin@royalacademy.com / admin123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err.message || err);
  printAtlasHelp();
  process.exit(1);
});
