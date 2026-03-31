const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const EventPackage = require('../models/EventPackage');
const Vendor = require('../models/Vendor');
const { protect, vendorOnly, adminOnly } = require('../middleware/auth');

// POST /api/bookings
router.post('/', protect, asyncHandler(async (req, res) => {
  const { packageId, eventDate, eventTime, eventAddress, city, notes } = req.body;

  const pkg = await EventPackage.findById(packageId);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });

  const booking = await Booking.create({
    customerId:   req.user._id,
    vendorId:     pkg.vendorId,
    packageId,
    packageName:  pkg.name,
    packageImage: pkg.images[0] || '',
    eventDate,
    eventTime,
    eventAddress,
    city:         city || pkg.city,
    totalAmount:  pkg.price,
    notes,
  });
  res.status(201).json(booking);
}));

// GET /api/bookings/my
router.get('/my', protect, asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customerId: req.user._id })
    .populate('packageId', 'name images eventType price')
    .populate({
      path: 'vendorId',
      select: 'businessName city logo userId',
      populate: { path: 'userId', select: 'name email phone' }
    })
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

// GET /api/bookings/vendor
router.get('/vendor', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor   = await Vendor.findOne({ userId: req.user._id });
  const bookings = await Booking.find({ vendorId: vendor._id })
    .populate('customerId', 'name email phone')
    .populate('packageId', 'name eventType')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

// GET /api/bookings/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('customerId', 'name email phone')
    .populate('vendorId', 'businessName city logo')
    .populate('packageId', 'name images eventType price inclusions duration');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
}));

// PUT /api/bookings/:id/status
router.put('/:id/status', protect, vendorOnly, asyncHandler(async (req, res) => {
  const vendor  = await Vendor.findOne({ userId: req.user._id });
  const booking = await Booking.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.status = req.body.status;
  await booking.save();
  res.json(booking);
}));

// PUT /api/bookings/:id/pay — dummy payment
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, customerId: req.user._id });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.paymentStatus = 'paid';
  await booking.save();
  res.json(booking);
}));

// GET /api/bookings — admin all bookings
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('customerId', 'name email')
    .populate('vendorId', 'businessName')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

module.exports = router;
