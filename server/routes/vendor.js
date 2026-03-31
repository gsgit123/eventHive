const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const EventPackage = require('../models/EventPackage');
const { protect, vendorOnly } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// GET /api/vendors
router.get('/', asyncHandler(async (req, res) => {
  const { city, category } = req.query;
  const query = { isApproved: true };
  if (city) query.city = { $regex: city, $options: 'i' };
  if (category) query.categories = category;
  const vendors = await Vendor.find(query).populate('userId', 'name email avatar').sort({ rating: -1 });
  res.json(vendors);
}));

// GET /api/vendors/:id — public profile
router.get('/:id', asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).populate('userId', 'name email avatar');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  const products = await Product.find({ vendorId: vendor._id, isActive: true }).limit(8);
  const packages = await EventPackage.find({ vendorId: vendor._id, isActive: true }).limit(6);
  res.json({ vendor, products, packages });
}));

// PUT /api/vendors/profile — vendor updates own profile
router.put('/profile', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  const { businessName, description, logo, city, state, address } = req.body;
  if (businessName) vendor.businessName = businessName;
  if (description)  vendor.description  = description;
  if (logo)         vendor.logo         = logo;
  if (city)         vendor.city         = city;
  if (state)        vendor.state        = state;
  if (address)      vendor.address      = address;
  await vendor.save();
  res.json(vendor);
}));

// POST /api/vendors/upload-logo
router.post('/upload-logo', protect, vendorOnly, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path });
}));

// GET /api/vendors/me/stats
router.get('/me/stats', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor      = await Vendor.findOne({ userId: req.user._id });
  const totalProducts = await Product.countDocuments({ vendorId: vendor._id });
  const totalPackages = await EventPackage.countDocuments({ vendorId: vendor._id });
  res.json({ vendor, totalProducts, totalPackages });
}));

module.exports = router;
