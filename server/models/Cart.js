const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:          String,
    image:         String,
    itemType:      { type: String, enum: ['sale', 'rent'], default: 'sale' },
    price:         Number,
    quantity:      { type: Number, default: 1 },
    rentDays:      { type: Number, default: 0 },
    rentStartDate: { type: Date },
    rentEndDate:   { type: Date },
    deposit:       { type: Number, default: 0 },
    vendorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
