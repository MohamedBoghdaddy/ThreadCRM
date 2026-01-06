import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/**
 * ThreadCRM Auth Middleware
 * - Accepts Bearer token OR cookie token
 * - Loads full user from DB (excluding password)
 * - Attaches req.user + req.token
 */
export const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  const token =
    (authHeader.startsWith("Bearer ") && authHeader.slice(7).trim()) ||
    req.cookies?.token;

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

    // ThreadCRM: your token should include user id (id or _id)
    const userId = decoded.id || decoded._id;
    if (!userId) {
      res.status(401);
      throw new Error("Invalid token payload: missing user id");
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    res.status(401);

    if (err.name === "TokenExpiredError") {
      throw new Error("Session expired. Please login again.");
    }

    throw new Error("Invalid authentication token");
  }
});

/**
 * Role-based authorization (optional)
 * Usage:
 *   router.post("/admin-only", auth, authorizeRoles("admin"))
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

// Common shortcut for ThreadCRM
export const adminOnly = authorizeRoles("admin");
