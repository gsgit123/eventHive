const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerName: String,
  reviewerAvatar: String,
  targetType:  { type: String, enum: ['product', 'package', 'vendor'], required: true },
  targetId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  comment:     { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
