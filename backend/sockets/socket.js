import socketAuth from "../utils/socketAuth.js";
import { setupPresence } from "./presence.socket.js";
import {
  setupChatSocket,
  markPendingMessagesDelivered,
} from "./chat.socket.js";

const setupSocket = (io) => {
  // Authentication middleware
  io.use(socketAuth);

  io.on("connection", async (socket) => {
    console.log(`Socket connected: ${socket.id}, User: ${socket.userId}`);

    // Setup presence (online/offline)
    await setupPresence(io, socket);

    // Setup chat handlers
    setupChatSocket(io, socket);

    // Mark pending messages as delivered on reconnect
    await markPendingMessagesDelivered(io, socket.userId);
  });
};

export default setupSocket;