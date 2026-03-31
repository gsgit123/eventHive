const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  packageId:     { type: mongoose.Schema.Types.ObjectId, ref: 'EventPackage', required: true },
  packageName:   String,
  packageImage:  String,
  eventDate:     { type: Date, required: true },
  eventTime:     { type: String, required: true },
  eventAddress:  { type: String, required: true },
  city:          { type: String, required: true },
  totalAmount:   { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  notes:         { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
