
// src/services/socket.js

import { io } from 'socket.io-client';

let socket = null;

// ==========================================
// INITIALIZE SOCKET
// ==========================================
export const initializeSocket = (token) => {
  // Existing socket ko disconnect karo
  if (socket) {
    socket.disconnect();
  }

  // Socket server URL
  const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    'http://localhost:5000';

  // Create Socket.IO connection
  socket = io(SOCKET_URL, {
    auth: {
      token: `Bearer ${token}`,
    },

    // Reconnection settings
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,

    // Transport
    transports: ['websocket', 'polling'],
  });

  // ==========================================
  // CONNECTION EVENTS
  // ==========================================

  socket.on('connect', () => {
    console.log(
      '✅ Socket connected:',
      socket.id
    );
  });

  socket.on('connect_error', (error) => {
    console.error(
      '❌ Socket connection error:',
      error.message
    );
  });

  socket.on('disconnect', (reason) => {
    console.log(
      '🔌 Socket disconnected:',
      reason
    );
  });

  socket.on('reconnect_attempt', (attempt) => {
    console.log(
      `🔄 Socket reconnect attempt: ${attempt}`
    );
  });

  socket.on('reconnect', (attempt) => {
    console.log(
      `✅ Socket reconnected after ${attempt} attempt(s)`
    );
  });

  return socket;
};

// ==========================================
// GET CURRENT SOCKET
// ==========================================
export const getSocket = () => {
  return socket;
};

// ==========================================
// DISCONNECT SOCKET
// ==========================================
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;

    console.log('🔌 Socket manually disconnected');
  }
};
