import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Protect routes - verifies JWT and attaches user to req
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        throw new Error("User not found, authorization denied");
      }

      return next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token invalid or expired");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

// Restrict a route to the resource owner (e.g. property host, booking guest)
export const ownerOnly = (getOwnerId) =>
  asyncHandler(async (req, res, next) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to perform this action");
    }
    next();
  });
