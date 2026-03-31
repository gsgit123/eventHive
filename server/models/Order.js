const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  orderType:  { type: String, enum: ['sale', 'rent'], default: 'sale' },
  items: [{
    productId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:          String,
    image:         String,
    price:         Number,
    quantity:      { type: Number, default: 1 },
    rentDays:      { type: Number, default: 0 },
    rentStartDate: { type: Date },
    rentEndDate:   { type: Date },
    deposit:       { type: Number, default: 0 },
  }],
  totalAmount:     { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'],
    default: 'pending',
  },
  paymentStatus:   { type: String, enum: ['pending', 'paid'], default: 'pending' },
  depositStatus:   { type: String, enum: ['held', 'refunded'], default: 'held' },
  shippingAddress: {
    name:    String,
    phone:   String,
    address: String,
    city:    String,
    state:   String,
    pincode: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
