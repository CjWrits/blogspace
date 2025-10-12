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

module.exports = router;
