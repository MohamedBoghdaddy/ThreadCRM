import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// Protect routes by verifying JWT token
const protect = asyncHandler((req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch (err) {
      res.status(401);
      throw new Error('Invalid or expired token');
    }
  }
  res.status(401);
  throw new Error('No token provided');
});

export default protect;
