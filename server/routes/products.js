const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { protect, vendorOnly } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// GET /api/products — with filters
router.get('/', asyncHandler(async (req, res) => {
  const { category, listingType, city, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };
  if (category)    query.category    = category;
  if (listingType) query.listingType = { $in: [listingType, 'both'] };
  if (city)        query.city        = { $regex: city, $options: 'i' };
  if (search)      query.name        = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    query.salePrice = {};
    if (minPrice) query.salePrice.$gte = Number(minPrice);
    if (maxPrice) query.salePrice.$lte = Number(maxPrice);
  }

  const sortOption = sort === 'price_asc'  ? { salePrice: 1 }
                   : sort === 'price_desc' ? { salePrice: -1 }
                   : sort === 'rating'     ? { rating: -1 }
                   : { createdAt: -1 };

  const total    = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('vendorId', 'businessName city logo rating')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
}));

// GET /api/products/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ rating: -1 }).limit(8)
    .populate('vendorId', 'businessName city');
  res.json(products);
}));

// GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('vendorId', 'businessName city logo rating totalReviews description');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// POST /api/products — vendor creates
router.post('/', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.status(400).json({ message: 'Vendor profile not found' });
  if (!vendor.isApproved) return res.status(403).json({ message: 'Vendor not approved yet' });

  const product = await Product.create({ ...req.body, vendorId: vendor._id, city: vendor.city });

  if (!vendor.categories.includes('products')) {
    vendor.categories.push('products');
    await vendor.save();
  }
  res.status(201).json(product);
}));

// PUT /api/products/:id
router.put('/:id', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor  = await Vendor.findOne({ userId: req.user._id });
  const product = await Product.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
}));

// DELETE /api/products/:id
router.delete('/:id', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor  = await Vendor.findOne({ userId: req.user._id });
  const product = await Product.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
}));

// POST /api/products/upload-image
router.post('/upload-image', protect, vendorOnly, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path });
}));

// GET /api/products/vendor/my
router.get('/vendor/my', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor   = await Vendor.findOne({ userId: req.user._id });
  const products = await Product.find({ vendorId: vendor._id }).sort({ createdAt: -1 });
  res.json(products);
}));

module.exports = router;
