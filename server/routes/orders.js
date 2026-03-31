const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Vendor = require('../models/Vendor');
const { protect, vendorOnly, adminOnly } = require('../middleware/auth');

// POST /api/orders — place order from cart
router.post('/', protect, asyncHandler(async (req, res) => {
  const { shippingAddress, orderType } = req.body;

  const cart = await Cart.findOne({ customerId: req.user._id });
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: 'Cart is empty' });

  // Group items by vendor
  const grouped = {};
  cart.items.forEach(item => {
    const vid = item.vendorId.toString();
    if (!grouped[vid]) grouped[vid] = [];
    grouped[vid].push(item);
  });

  const orders = [];
  for (const [vendorId, items] of Object.entries(grouped)) {
    const total = items.reduce((sum, i) => {
      const base = i.itemType === 'rent' ? i.price * i.rentDays + i.deposit : i.price * i.quantity;
      return sum + base;
    }, 0);

    const order = await Order.create({
      customerId: req.user._id,
      vendorId,
      orderType: orderType || 'sale',
      items,
      totalAmount: total,
      shippingAddress,
    });
    orders.push(order);
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(orders);
}));

// GET /api/orders/my — customer's orders
router.get('/my', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id })
    .populate('vendorId', 'businessName city logo')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// GET /api/orders/vendor — vendor's incoming orders
router.get('/vendor', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const orders = await Order.find({ vendorId: vendor._id })
    .populate('customerId', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customerId', 'name email phone')
    .populate('vendorId', 'businessName city logo');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

// PUT /api/orders/:id/status — vendor updates status
router.put('/:id/status', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const order  = await Order.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  await order.save();
  res.json(order);
}));

// PUT /api/orders/:id/pay — dummy payment
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customerId: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentStatus = 'paid';
  await order.save();
  res.json(order);
}));

// PUT /api/orders/:id/refund-deposit — vendor refunds deposit (rent)
router.put('/:id/refund-deposit', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const order  = await Order.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.depositStatus = 'refunded';
  await order.save();
  res.json(order);
}));

// GET /api/orders — admin all orders
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('customerId', 'name email')
    .populate('vendorId', 'businessName')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

module.exports = router;
