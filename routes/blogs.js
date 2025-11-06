const router = require('express').Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create blog
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const blog = new Blog({ title, content, tags, author: req.user.id });
    await blog.save();
    const populatedBlog = await Blog.findById(blog._id).populate('author', 'name');
    res.json(populatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update blog
router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    
    // Allow admin or blog author to update
    const isAdmin = req.user._id === 'admin' || req.user.isAdmin;
    const isAuthor = blog.author.toString() === req.user._id || blog.author.toString() === req.user.id;
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    Object.assign(blog, req.body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    
    // Allow admin or blog author to delete
    const isAdmin = req.user._id === 'admin' || req.user.isAdmin;
    const isAuthor = blog.author.toString() === req.user._id || blog.author.toString() === req.user.id;
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
