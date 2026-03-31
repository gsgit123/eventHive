const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/cart
router.get('/', protect, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ customerId: req.user._id });
  if (!cart) cart = await Cart.create({ customerId: req.user._id, items: [] });
  res.json(cart);
}));

// POST /api/cart/add
router.post('/add', protect, asyncHandler(async (req, res) => {
  const { productId, quantity, itemType, rentDays, rentStartDate, rentEndDate } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ customerId: req.user._id });
  if (!cart) cart = await Cart.create({ customerId: req.user._id, items: [] });

  const price   = itemType === 'rent' ? product.rentPrice : product.salePrice;
  const deposit = itemType === 'rent' ? product.rentDeposit : 0;

  const existIdx = cart.items.findIndex(
    i => i.productId.toString() === productId && i.itemType === itemType
  );

  if (existIdx >= 0) {
    cart.items[existIdx].quantity = (cart.items[existIdx].quantity || 1) + (quantity || 1);
  } else {
    cart.items.push({
      productId,
      name:  product.name,
      image: product.images[0] || '',
      vendorId: product.vendorId,
      itemType: itemType || 'sale',
      price,
      quantity: quantity || 1,
      rentDays:      itemType === 'rent' ? rentDays      : 0,
      rentStartDate: itemType === 'rent' ? rentStartDate : null,
      rentEndDate:   itemType === 'rent' ? rentEndDate   : null,
      deposit,
    });
  }

  await cart.save();
  res.json(cart);
}));

// PUT /api/cart/update
router.put('/update', protect, asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  const cart = await Cart.findOne({ customerId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.quantity = quantity;
  await cart.save();
  res.json(cart);
}));

// DELETE /api/cart/remove/:itemId
router.delete('/remove/:itemId', protect, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customerId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json(cart);
}));

// DELETE /api/cart/clear
router.delete('/clear', protect, asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ customerId: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
}));

module.exports = router;
