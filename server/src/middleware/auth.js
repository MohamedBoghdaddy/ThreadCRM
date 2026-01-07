import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/**
 * ThreadCRM Auth Middleware
 * - Reads JWT from Authorization: Bearer <token> or cookie
 * - Supports token payload: userId | id | _id
 * - Loads user document (without password)
 */
export const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  let token = null;

  // 1) Bearer token
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  // 2) Cookie fallback
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error("Authentication required: no token provided");
  }

  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("Server misconfigured: JWT_SECRET is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FIX — support all possible token field names
    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      res.status(401);
      throw new Error("Invalid token payload: missing user id");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Attach
    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401);

    if (err.name === "TokenExpiredError") {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Invalid authentication token");
  }
});

/**
 * Role-based authorization helper
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied — requires: ${roles.join(", ")}`,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

export const adminOnly = authorizeRoles("admin");
