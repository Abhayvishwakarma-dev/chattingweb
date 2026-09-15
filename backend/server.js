import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";

// FIRST: Load .env
dotenv.config();

// SECOND: Import secrets (which will ensure .env is complete)
import "./config/secrets.js";

// THIRD: Connect to database
import connectDB from "./config/db.js";

// FOURTH: Import passport (after env is loaded)
import "./config/passport.js";

// ... rest of imports
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import setupSocket from "./sockets/socket.js";

const app = express();

console.log('\n🔐 Environment Status:');
console.log(`JWT_ACCESS_SECRET: ${process.env.JWT_ACCESS_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`JWT_REFRESH_SECRET: ${process.env.JWT_REFRESH_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' ? '✅ Set' : '⚠️  Not configured'}`);

// Database Connection
connectDB();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(passport.initialize());

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WhatsApp Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Error Handler
app.use(errorMiddleware);

// Create HTTP Server
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

setupSocket(io);

// Start Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
📡 Socket.IO running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || "development"}
  `);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  httpServer.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});