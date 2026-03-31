const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const EventPackage = require('../models/EventPackage');
const Vendor = require('../models/Vendor');
const { protect, vendorOnly } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// GET /api/events
router.get('/', asyncHandler(async (req, res) => {
  const { eventType, city, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };
  if (eventType) query.eventType = eventType;
  if (city) query.city = { $regex: city, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortOption = sort === 'price_asc'  ? { price: 1 }
                   : sort === 'price_desc' ? { price: -1 }
                   : sort === 'rating'     ? { rating: -1 }
                   : { createdAt: -1 };

  const total    = await EventPackage.countDocuments(query);
  const packages = await EventPackage.find(query)
    .populate('vendorId', 'businessName city logo rating')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ packages, total, page: Number(page), pages: Math.ceil(total / limit) });
}));

// GET /api/events/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const packages = await EventPackage.find({ isActive: true })
    .sort({ rating: -1 }).limit(6)
    .populate('vendorId', 'businessName city');
  res.json(packages);
}));

// GET /api/events/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const pkg = await EventPackage.findById(req.params.id)
    .populate('vendorId', 'businessName city logo rating totalReviews description address');
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  res.json(pkg);
}));

// POST /api/events — vendor creates
router.post('/', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.status(400).json({ message: 'Vendor not found' });
  if (!vendor.isApproved) return res.status(403).json({ message: 'Vendor not approved yet' });

  const pkg = await EventPackage.create({ ...req.body, vendorId: vendor._id, city: vendor.city });

  if (!vendor.categories.includes('events')) {
    vendor.categories.push('events');
    await vendor.save();
  }
  res.status(201).json(pkg);
}));

// PUT /api/events/:id
router.put('/:id', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const pkg    = await EventPackage.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  Object.assign(pkg, req.body);
  await pkg.save();
  res.json(pkg);
}));

// DELETE /api/events/:id
router.delete('/:id', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const pkg    = await EventPackage.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  await pkg.deleteOne();
  res.json({ message: 'Package deleted' });
}));

// POST /api/events/upload-image
router.post('/upload-image', protect, vendorOnly, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path });
}));

// GET /api/events/vendor/my
router.get('/vendor/my', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor   = await Vendor.findOne({ userId: req.user._id });
  const packages = await EventPackage.find({ vendorId: vendor._id }).sort({ createdAt: -1 });
  res.json(packages);
}));

module.exports = router;
