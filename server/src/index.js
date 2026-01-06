import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import crmRoutes from './routes/crm.js';
import chatRoutes from './routes/chat.js';
import { initSocket } from './socket.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Apply common middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
// Log HTTP requests in development mode
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use("/api/auth", authRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/chat", chatRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocket(server);

// Connect to MongoDB and start the server
const start = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 4000;
    server.listen(port, () => {
      console.log('Server running on port', port);
    });
  } catch (err) {
    console.error(err);
  }
};

// Register catch‑all and error handlers after routes
app.use(notFound);
app.use(errorHandler);

start();
