const mongoose = require('mongoose');

const eventPackageSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  eventType: {
    type: String,
    enum: ['Birthday', 'Wedding', 'Proposal', 'Anniversary', 'Festive', 'Baby Shower', 'Corporate'],
    required: true,
  },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  inclusions: [{ type: String }],
  duration: { type: String, default: '4-5 hours' },
  city: { type: String, required: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('EventPackage', eventPackageSchema);
