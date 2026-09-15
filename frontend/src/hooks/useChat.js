import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

/**
 * Custom hook to access chat context
 * @returns {Object} Chat context value
 * @property {Array} chats - List of user chats
 * @property {Function} setChats - Update chats list
 * @property {Object} currentChat - Currently selected chat
 * @property {Function} setCurrentChat - Set current chat
 * @property {Array} messages - Messages of current chat
 * @property {Function} setMessages - Update messages
 * @property {boolean} loading - Chat loading state
 * @property {Object} typingUsers - Users currently typing
 * @property {Function} loadChats - Load all chats
 * @property {Function} loadMessages - Load messages for a chat
 * @property {Function} sendMessage - Send message via HTTP
 * @property {Function} sendMessageSocket - Send message via Socket.IO
 * @property {Function} sendTypingStart - Send typing start event
 * @property {Function} sendTypingStop - Send typing stop event
 * @property {Function} markMessageAsRead - Mark message as read
 * @property {Function} createChat - Create new chat
 * @property {Function} deleteChat - Delete chat
 * @property {Function} isUserOnline - Check if user is online
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};

export default useChat;