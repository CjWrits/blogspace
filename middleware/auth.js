const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle admin token
    if (verified.id === 'admin') {
      req.user = {
        _id: 'admin',
        name: 'Administrator',
        email: process.env.ADMIN_EMAIL,
        isAdmin: true
      };
      return next();
    }
    
    const user = await User.findById(verified.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
