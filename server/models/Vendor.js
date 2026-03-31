const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  address: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  categories: [{ type: String, enum: ['products', 'events'] }],
  totalSales: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
