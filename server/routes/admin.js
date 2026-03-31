const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Product = require('../models/Product');
const EventPackage = require('../models/EventPackage');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, asyncHandler(async (req, res) => {
  const [users, vendors, orders, bookings, products, packages] = await Promise.all([
    User.countDocuments(),
    Vendor.countDocuments(),
    Order.countDocuments(),
    Booking.countDocuments(),
    Product.countDocuments(),
    EventPackage.countDocuments(),
  ]);
  res.json({ users, vendors, orders, bookings, products, packages });
}));

// GET /api/admin/vendors
router.get('/vendors', protect, adminOnly, asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({})
    .populate('userId', 'name email phone createdAt')
    .sort({ createdAt: -1 });
  res.json(vendors);
}));

// PUT /api/admin/vendors/:id/approve
router.put('/vendors/:id/approve', protect, adminOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  vendor.isApproved = true;
  await vendor.save();
  res.json({ message: 'Vendor approved', vendor });
}));

// PUT /api/admin/vendors/:id/reject
router.put('/vendors/:id/reject', protect, adminOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  vendor.isApproved = false;
  await vendor.save();
  res.json({ message: 'Vendor rejected', vendor });
}));

// GET /api/admin/orders
router.get('/orders', protect, adminOnly, asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('customerId', 'name email')
    .populate('vendorId', 'businessName')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// GET /api/admin/bookings
router.get('/bookings', protect, adminOnly, asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('customerId', 'name email')
    .populate('vendorId', 'businessName')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

// GET /api/admin/users
router.get('/users', protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
}));

module.exports = router;
