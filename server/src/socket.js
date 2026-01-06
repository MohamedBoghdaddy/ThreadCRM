import { Server } from 'socket.io';
import Message from './models/Message.js';
import Thread from './models/Thread.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinThread', (threadId) => {
      socket.join(threadId);
    });

    socket.on('leaveThread', (threadId) => {
      socket.leave(threadId);
    });

    socket.on('sendMessage', async ({ threadId, senderId, text }) => {
      try {
        const message = await Message.create({ threadId, senderId, text });
        // update thread lastMessageAt
        await Thread.findByIdAndUpdate(threadId, { lastMessageAt: new Date() });
        io.to(threadId).emit('newMessage', message);
      } catch (error) {
        console.error(error);
      }
    });
  });
};
