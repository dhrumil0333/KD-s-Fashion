const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/userAuth'); // token-based auth

// Get profile of the logged-in user
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// PUT /api/user/update
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});


module.exports = router;
