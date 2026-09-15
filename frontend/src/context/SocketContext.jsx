import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = getSocket();
    if (s) {
      setSocket(s);
      setIsConnected(s.connected);

      // Socket event listeners
      s.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      s.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      s.on('online_users', ({ userIds }) => {
        setOnlineUsers(userIds || []);
      });

      s.on('user_online', ({ userId }) => {
        setOnlineUsers(prev => [...new Set([...prev, userId])]);
      });

      s.on('user_offline', ({ userId }) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      return () => {
        s.off('connect');
        s.off('disconnect');
        s.off('online_users');
        s.off('user_online');
        s.off('user_offline');
      };
    }
  }, [isAuthenticated]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    isUserOnline: (userId) => onlineUsers.includes(userId),
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};