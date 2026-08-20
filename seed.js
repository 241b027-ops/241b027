import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";

dotenv.config();
connectDB();

const sampleImage = (seed) => ({
  url: `https://picsum.photos/seed/${seed}/1200/800`,
  publicId: "",
});

const run = async () => {
  try {
    if (process.argv.includes("-d")) {
      await Promise.all([User.deleteMany(), Property.deleteMany(), Booking.deleteMany()]);
      console.log("Data destroyed");
      process.exit();
    }

    await Promise.all([User.deleteMany(), Property.deleteMany(), Booking.deleteMany()]);

    const host = await User.create({
      name: "Jordan Kim",
      email: "host@example.com",
      password: "password123",
      isHost: true,
    });

    const guest = await User.create({
      name: "Alex Rivera",
      email: "guest@example.com",
      password: "password123",
      isHost: false,
    });

    const listings = [
      {
        host: host._id,
        title: "Sunlit Loft in the Arts District",
        description:
          "A bright, minimalist loft with exposed brick, a rooftop terrace, and a five-minute walk to galleries and coffee shops.",
        propertyType: "Loft",
        location: { address: "142 Gallery St", city: "Los Angeles", state: "CA", country: "USA", zipCode: "90013" },
        pricePerNight: 145,
        cleaningFee: 35,
        maxGuests: 4,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        amenities: ["Wifi", "Kitchen", "Air conditioning", "Workspace", "TV"],
        images: [sampleImage("loft1"), sampleImage("loft2")],
      },
      {
        host: host._id,
        title: "Cliffside Cottage with Ocean Views",
        description:
          "Fall asleep to the sound of waves in this cozy cottage perched above the coastline, with a private deck and firepit.",
        propertyType: "Cottage",
        location: { address: "8 Bluff Rd", city: "Big Sur", state: "CA", country: "USA", zipCode: "93920" },
        pricePerNight: 260,
        cleaningFee: 60,
        maxGuests: 3,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        amenities: ["Wifi", "Kitchen", "Heating", "Fireplace", "Free parking"],
        images: [sampleImage("cottage1"), sampleImage("cottage2")],
      },
      {
        host: host._id,
        title: "Modern Family House Near the Lake",
        description:
          "Spacious four-bedroom house with a big backyard, full kitchen, and a short drive to the lakefront and hiking trails.",
        propertyType: "House",
        location: { address: "22 Pinewood Ave", city: "Lake Tahoe", state: "CA", country: "USA", zipCode: "96150" },
        pricePerNight: 310,
        cleaningFee: 80,
        maxGuests: 8,
        bedrooms: 4,
        beds: 5,
        bathrooms: 2.5,
        amenities: ["Wifi", "Kitchen", "Washer", "Dryer", "Free parking", "Fireplace", "TV"],
        images: [sampleImage("house1"), sampleImage("house2")],
      },
      {
        host: host._id,
        title: "Downtown Studio, Steps from Everything",
        description:
          "Compact and efficient studio in the heart of downtown, perfect for solo travelers or couples exploring the city.",
        propertyType: "Studio",
        location: { address: "500 Market St", city: "San Francisco", state: "CA", country: "USA", zipCode: "94105" },
        pricePerNight: 120,
        cleaningFee: 25,
        maxGuests: 2,
        bedrooms: 0,
        beds: 1,
        bathrooms: 1,
        amenities: ["Wifi", "Kitchen", "Air conditioning", "Workspace"],
        images: [sampleImage("studio1"), sampleImage("studio2")],
      },
    ];

    await Property.insertMany(listings);

    console.log("Seed data created:");
    console.log("  Host login:  host@example.com / password123");
    console.log("  Guest login: guest@example.com / password123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
