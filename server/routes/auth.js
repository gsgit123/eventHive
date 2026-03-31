const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, city, state, businessName } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role: role || 'customer', phone, city, state });

  if (role === 'vendor') {
    await Vendor.create({
      userId: user._id,
      businessName: businessName || name,
      city: city || '',
      categories: [],
    });
  }

  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, city: user.city, token: generateToken(user._id),
  });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  let vendorData = null;
  if (user.role === 'vendor') {
    vendorData = await Vendor.findOne({ userId: user._id });
  }

  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    city: user.city, phone: user.phone, avatar: user.avatar,
    token: generateToken(user._id), vendor: vendorData,
  });
}));

// GET /api/auth/me
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  let vendorData = null;
  if (user.role === 'vendor') vendorData = await Vendor.findOne({ userId: user._id });
  res.json({ ...user.toObject(), vendor: vendorData });
}));

// PUT /api/auth/profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name    = req.body.name    || user.name;
  user.phone   = req.body.phone   || user.phone;
  user.city    = req.body.city    || user.city;
  user.state   = req.body.state   || user.state;
  user.avatar  = req.body.avatar  || user.avatar;
  if (req.body.password) user.password = req.body.password;
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, city: user.city, role: user.role });
}));

module.exports = router;
