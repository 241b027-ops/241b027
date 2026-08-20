import asyncHandler from "express-async-handler";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Get all properties (with search + filters)
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  const {
    city,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    propertyType,
    amenities,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = req.query;

  const query = { isActive: true };

  if (city) {
    query["location.city"] = { $regex: city, $options: "i" };
  }

  if (guests) {
    query.maxGuests = { $gte: Number(guests) };
  }

  if (propertyType) {
    query.propertyType = propertyType;
  }

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  if (amenities) {
    const amenityList = Array.isArray(amenities) ? amenities : amenities.split(",");
    query.amenities = { $all: amenityList };
  }

  let propertyIds = null;

  // Availability filter: exclude properties with overlapping confirmed bookings
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const overlapping = await Booking.find({
      status: { $in: ["confirmed", "pending"] },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    }).distinct("property");

    query._id = { $nin: overlapping };
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(query)
      .populate("host", "name avatar")
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Property.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: properties.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    properties,
  });
});

// @desc    Get single property by id
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate("host", "name avatar email createdAt");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Existing confirmed bookings, used by the frontend calendar to block dates
  const bookings = await Booking.find({
    property: property._id,
    status: { $in: ["confirmed", "pending"] },
  }).select("checkIn checkOut -_id");

  res.json({ success: true, property, bookedRanges: bookings });
});

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (host)
export const createProperty = asyncHandler(async (req, res) => {
  const body = req.body;

  const images = (req.files || []).map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  const property = await Property.create({
    host: req.user._id,
    title: body.title,
    description: body.description,
    propertyType: body.propertyType,
    location: {
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country,
      zipCode: body.zipCode,
    },
    pricePerNight: body.pricePerNight,
    cleaningFee: body.cleaningFee || 0,
    maxGuests: body.maxGuests,
    bedrooms: body.bedrooms,
    beds: body.beds,
    bathrooms: body.bathrooms,
    amenities: body.amenities ? JSON.parse(body.amenities) : [],
    images,
  });

  res.status(201).json({ success: true, property });
});

// @desc    Update a property listing
// @route   PUT /api/properties/:id
// @access  Private (host who owns the listing)
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this listing");
  }

  const body = req.body;
  const fields = [
    "title",
    "description",
    "propertyType",
    "pricePerNight",
    "cleaningFee",
    "maxGuests",
    "bedrooms",
    "beds",
    "bathrooms",
    "isActive",
  ];
  fields.forEach((field) => {
    if (body[field] !== undefined) property[field] = body[field];
  });

  if (body.amenities) {
    property.amenities = JSON.parse(body.amenities);
  }

  if (body.address || body.city || body.state || body.country || body.zipCode) {
    property.location = {
      ...property.location.toObject(),
      ...(body.address && { address: body.address }),
      ...(body.city && { city: body.city }),
      ...(body.state && { state: body.state }),
      ...(body.country && { country: body.country }),
      ...(body.zipCode && { zipCode: body.zipCode }),
    };
  }

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
    property.images = [...property.images, ...newImages];
  }

  const updated = await property.save();
  res.json({ success: true, property: updated });
});

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private (host who owns the listing)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this listing");
  }

  // Best-effort cleanup of images stored on Cloudinary
  await Promise.all(
    property.images
      .filter((img) => img.publicId)
      .map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => null))
  );

  await property.deleteOne();
  res.json({ success: true, message: "Listing deleted" });
});

// @desc    Remove a single image from a listing
// @route   DELETE /api/properties/:id/images/:publicId
// @access  Private (host who owns the listing)
export const deletePropertyImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this listing");
  }

  const { publicId } = req.params;
  property.images = property.images.filter((img) => img.publicId !== publicId);
  await property.save();
  await cloudinary.uploader.destroy(publicId).catch(() => null);

  res.json({ success: true, property });
});

// @desc    Get listings owned by the logged-in host
// @route   GET /api/properties/host/mine
// @access  Private (host)
export const getMyListings = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).sort("-createdAt");
  res.json({ success: true, count: properties.length, properties });
});
