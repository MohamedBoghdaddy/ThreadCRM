import express from 'express';
import asyncHandler from 'express-async-handler';
import Lead from '../models/Lead.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Dashboard: return total leads, hot leads, and recent leads
router.get('/dashboard', auth, asyncHandler(async (req, res) => {
  const totalLeads = await Lead.countDocuments();
  const hotLeads = await Lead.countDocuments({ status: 'hot' });
  const recent = await Lead.find().sort({ createdAt: -1 }).limit(10);
  res.json({ totalLeads, hotLeads, recent });
}));

// Get all leads
router.get('/leads', auth, asyncHandler(async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
}));

// Create a new lead
router.post('/leads', auth, asyncHandler(async (req, res) => {
  const lead = await Lead.create(req.body);
  res.status(201).json(lead);
}));

export default router;
