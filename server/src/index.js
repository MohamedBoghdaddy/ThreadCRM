import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import crmRoutes from "./routes/crm.js";
import chatRoutes from "./routes/chat.js";
import { initSocket } from "./socket.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// =======================
// ENV VALIDATION
// =======================
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

const app = express();
app.set("trust proxy", 1);

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(helmet());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/chat", chatRoutes);

// =======================
// ERROR HANDLERS
// =======================
app.use(notFound);
app.use(errorHandler);

// =======================
// SERVER + SOCKET.IO
// =======================
const server = http.createServer(app);
initSocket(server);

// =======================
// START SERVER
// =======================
const start = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

start();
