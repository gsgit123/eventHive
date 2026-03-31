const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const EventPackage = require('../models/EventPackage');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/auth');

// POST /api/reviews
router.post('/', protect, asyncHandler(async (req, res) => {
  const { targetType, targetId, rating, comment } = req.body;

  const review = await Review.create({
    reviewerId:     req.user._id,
    reviewerName:   req.user.name,
    reviewerAvatar: req.user.avatar,
    targetType,
    targetId,
    rating,
    comment,
  });

  // Update rating on target
  const reviews = await Review.find({ targetType, targetId });
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  if (targetType === 'product') {
    await Product.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), totalReviews: reviews.length });
  } else if (targetType === 'package') {
    await EventPackage.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), totalReviews: reviews.length });
  } else if (targetType === 'vendor') {
    await Vendor.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), totalReviews: reviews.length });
  }

  res.status(201).json(review);
}));

// GET /api/reviews/:targetType/:targetId
router.get('/:targetType/:targetId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    targetType: req.params.targetType,
    targetId:   req.params.targetId,
  }).sort({ createdAt: -1 });
  res.json(reviews);
}));

module.exports = router;
