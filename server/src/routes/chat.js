import express from 'express';
import asyncHandler from 'express-async-handler';
import Thread from '../models/Thread.js';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all threads for the authenticated user
router.get('/threads', auth, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const threads = await Thread.find({ participants: userId }).sort({ updatedAt: -1 });
  res.json(threads);
}));

// Create a new thread with participants
router.post('/threads', auth, asyncHandler(async (req, res) => {
  const { participantIds } = req.body;
  const thread = await Thread.create({
    participants: [req.user.userId, ...participantIds],
    lastMessageAt: new Date(),
  });
  res.status(201).json(thread);
}));

// Get messages for a thread
router.get('/threads/:id/messages', auth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const messages = await Message.find({ threadId: id }).sort({ createdAt: 1 });
  res.json(messages);
}));

export default router;
