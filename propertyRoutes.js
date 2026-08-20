import express from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  getMyListings,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/host/mine", protect, getMyListings);
router.get("/:id", getPropertyById);

router.post("/", protect, upload.array("images", 10), createProperty);
router.put("/:id", protect, upload.array("images", 10), updateProperty);
router.delete("/:id", protect, deleteProperty);
router.delete("/:id/images/:publicId", protect, deletePropertyImage);

export default router;
