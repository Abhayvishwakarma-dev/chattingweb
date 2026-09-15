


import User from "../models/User.js"; 
 
// Map to store online users and their sockets 
const onlineUsers = new Map(); 
 
const userRoom = (userId) => `user:${userId}`; 
 
export const getOnlineUsers = () => onlineUsers; 
 
export const addSocket = (userId, socketId) => { 
  userId = userId.toString(); 
 
  if (!onlineUsers.has(userId)) { 
    onlineUsers.set(userId, new Set()); 
  } 
 
  onlineUsers.get(userId).add(socketId); 
}; 
 
export const removeSocket = (userId, socketId) => { 
  userId = userId.toString(); 
  const sockets = onlineUsers.get(userId); 
 
  if (!sockets) return false; 
 
  sockets.delete(socketId); 
 
  if (sockets.size === 0) { 
    onlineUsers.delete(userId); 
    return true; 
  } 
 
  return false; 
}; 
 
export const setupPresence = async (io, socket) => { 
  const userId = socket.userId.toString(); 

  socket.join(userRoom(userId));  // <-- ADDED LINE
 
  const alreadyOnline = onlineUsers.has(userId); 
 
  addSocket(userId, socket.id); 
 
  // First socket = user came online 
  if (!alreadyOnline) { 
    await User.findByIdAndUpdate(userId, { 
      isOnline: true, 
      lastSeen: null, 
    }); 
 
    socket.broadcast.emit("user_online", { userId }); 
  } 
 
  // Send current online users to client 
  socket.emit("online_users", { 
    userIds: Array.from(onlineUsers.keys()), 
  }); 
 
  // Handle disconnect 
  socket.on("disconnect", async () => { 
    const becameOffline = removeSocket(userId, socket.id); 
 
    if (becameOffline) { 
      const lastSeen = new Date(); 
 
      await User.findByIdAndUpdate(userId, { 
        isOnline: false, 
        lastSeen, 
      }); 
 
      socket.broadcast.emit("user_offline", { 
        userId, 
        lastSeen, 
      }); 
    } 
  }); 
};