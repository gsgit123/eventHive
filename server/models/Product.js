const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Balloons', 'Lights', 'Props', 'Flowers', 'Furniture', 'Backdrops', 'Candles', 'Ribbons', 'Tableware', 'Other'],
    required: true,
  },
  listingType: { type: String, enum: ['sale', 'rent', 'both'], default: 'sale' },
  salePrice: { type: Number, default: 0 },
  discountPrice: { type: Number, default: 0 },
  rentPrice: { type: Number, default: 0 },       // per day
  rentMinDays: { type: Number, default: 1 },
  rentDeposit: { type: Number, default: 0 },
  images: [{ type: String }],
  stock: { type: Number, default: 1 },
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  city: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Optimize frequent queries
productSchema.index({ category: 1, listingType: 1, city: 1 });
productSchema.index({ vendorId: 1, rating: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
