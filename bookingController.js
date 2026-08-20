import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";

const msPerNight = 1000 * 60 * 60 * 24;

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, guests } = req.body;

  if (!propertyId || !checkIn || !checkOut || !guests) {
    res.status(400);
    throw new Error("Please provide propertyId, checkIn, checkOut, and guests");
  }

  const property = await Property.findById(propertyId);
  if (!property || !property.isActive) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.host.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Hosts cannot book their own listing");
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    res.status(400);
    throw new Error("Invalid check-in/check-out dates");
  }

  if (start < new Date().setHours(0, 0, 0, 0)) {
    res.status(400);
    throw new Error("Check-in date cannot be in the past");
  }

  const nights = Math.round((end - start) / msPerNight);

  if (Number(guests) > property.maxGuests) {
    res.status(400);
    throw new Error(`This listing sleeps a maximum of ${property.maxGuests} guests`);
  }

  // Check for overlapping bookings (double-booking prevention)
  const overlap = await Booking.findOne({
    property: propertyId,
    status: { $in: ["confirmed", "pending"] },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });

  if (overlap) {
    res.status(409);
    throw new Error("These dates are no longer available for this property");
  }

  const totalPrice = nights * property.pricePerNight + (property.cleaningFee || 0);

  const booking = await Booking.create({
    property: propertyId,
    guest: req.user._id,
    checkIn: start,
    checkOut: end,
    guests,
    nights,
    pricePerNight: property.pricePerNight,
    cleaningFee: property.cleaningFee || 0,
    totalPrice,
    status: "confirmed",
  });

  const populated = await booking.populate("property", "title images location pricePerNight");

  res.status(201).json({ success: true, booking: populated });
});

// @desc    Get bookings made by the logged-in user
// @route   GET /api/bookings/mine
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate("property", "title images location pricePerNight host")
    .sort("-createdAt");

  res.json({ success: true, count: bookings.length, bookings });
});

// @desc    Get bookings for listings owned by the logged-in host
// @route   GET /api/bookings/host
// @access  Private (host)
export const getHostBookings = asyncHandler(async (req, res) => {
  const myProperties = await Property.find({ host: req.user._id }).select("_id");
  const propertyIds = myProperties.map((p) => p._id);

  const bookings = await Booking.find({ property: { $in: propertyIds } })
    .populate("property", "title images location")
    .populate("guest", "name email avatar")
    .sort("-createdAt");

  res.json({ success: true, count: bookings.length, bookings });
});

// @desc    Get a single booking
// @route   GET /api/bookings/:id
// @access  Private (guest or host of the property)
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("property", "title images location pricePerNight host")
    .populate("guest", "name email avatar");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isGuest = booking.guest._id.toString() === req.user._id.toString();
  const isHost = booking.property.host.toString() === req.user._id.toString();

  if (!isGuest && !isHost) {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.json({ success: true, booking });
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (guest who made it, or host of the property)
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("property", "host");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isGuest = booking.guest.toString() === req.user._id.toString();
  const isHost = booking.property.host.toString() === req.user._id.toString();

  if (!isGuest && !isHost) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (booking.status === "cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({ success: true, booking });
});
