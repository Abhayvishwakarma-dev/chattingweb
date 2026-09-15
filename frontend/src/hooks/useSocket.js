import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * Custom hook to access socket context
 * @returns {Object} Socket context value
 * @property {Object} socket - Socket.IO instance
 * @property {boolean} isConnected - Socket connection status
 * @property {Array} onlineUsers - List of online user IDs
 * @property {Function} isUserOnline - Check if specific user is online
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

export default useSocket;