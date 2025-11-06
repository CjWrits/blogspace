const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json({ user, blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.id === 'admin' || req.user.isAdmin) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json(users);
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
