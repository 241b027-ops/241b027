import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 3000,
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Cabin", "Loft", "Cottage", "Studio", "Other"],
      default: "Apartment",
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, default: "" },
      country: { type: String, required: true },
      zipCode: { type: String, default: "" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: 0,
    },
    cleaningFee: { type: Number, default: 0, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    beds: { type: Number, required: true, min: 1 },
    bathrooms: { type: Number, required: true, min: 0.5 },
    amenities: [
      {
        type: String,
        enum: [
          "Wifi",
          "Kitchen",
          "Washer",
          "Dryer",
          "Air conditioning",
          "Heating",
          "Free parking",
          "Pool",
          "Hot tub",
          "TV",
          "Workspace",
          "Pets allowed",
          "Gym",
          "Fireplace",
          "BBQ grill",
        ],
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    unavailableDates: [
      {
        type: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

propertySchema.index({ "location.city": "text", title: "text", description: "text" });

const Property = mongoose.model("Property", propertySchema);
export default Property;
