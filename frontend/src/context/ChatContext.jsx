// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { chatService, messageService } from '../services/chat';
// import { useAuth } from './AuthContext';
// import { useSocket } from './SocketContext';
// import toast from 'react-hot-toast';

// const ChatContext = createContext();

// export const useChat = () => useContext(ChatContext);

// export const ChatProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { socket, isUserOnline } = useSocket();
//   const [chats, setChats] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [typingUsers, setTypingUsers] = useState({});

//   // Load chats
//   const loadChats = async () => {
//     try {
//       setLoading(true);
//       const response = await chatService.getAll();
//       if (response.success) {
//         setChats(response.data);
//       }
//     } catch (error) {
//       toast.error('Failed to load chats');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       loadChats();
//     }
//   }, [user]);

//   // Socket event listeners
//   useEffect(() => {
//     if (!socket) return;

//     // New message
//     socket.on('new_message', ({ message }) => {
//       // Add message to current chat
//       if (currentChat?._id === message.chatId) {
//         setMessages(prev => [...prev, message]);
//       }

//       // Update chat list
//       setChats(prev => {
//         const updated = prev.map(chat => {
//           if (chat._id === message.chatId) {
//             return {
//               ...chat,
//               lastMessage: message,
//               lastMessageAt: message.createdAt,
//             };
//           }
//           return chat;
//         });

//         // Sort by lastMessageAt
//         return updated.sort((a, b) => 
//           new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
//         );
//       });
//     });

//     // Message status update
//     socket.on('message_status', ({ messageId, status }) => {
//       setMessages(prev =>
//         prev.map(msg =>
//           msg._id === messageId ? { ...msg, status } : msg
//         )
//       );
//     });

//     // Typing events
//     socket.on('typing_start', ({ senderId, chatId }) => {
//       if (currentChat?._id === chatId) {
//         setTypingUsers(prev => ({ ...prev, [senderId]: true }));
//       }
//     });

//     socket.on('typing_stop', ({ senderId, chatId }) => {
//       if (currentChat?._id === chatId) {
//         setTypingUsers(prev => ({ ...prev, [senderId]: false }));
//       }
//     });

//     return () => {
//       socket.off('new_message');
//       socket.off('message_status');
//       socket.off('typing_start');
//       socket.off('typing_stop');
//     };
//   }, [socket, currentChat]);

//   // Load messages for a chat
//   const loadMessages = async (chatId, page = 1) => {
//     try {
//       setLoading(true);
//       const response = await messageService.getMessages(chatId, page);
//       if (response.success) {
//         setMessages(response.data.messages || []);
//         return response.data;
//       }
//     } catch (error) {
//       toast.error('Failed to load messages');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send message
//   const sendMessage = async (chatId, content, type = 'text') => {
//     try {
//       const response = await messageService.send({
//         chatId,
//         content,
//         type,
//       });

//       if (response.success) {
//         setMessages(prev => [...prev, response.data]);
//         return response.data;
//       }
//     } catch (error) {
//       toast.error('Failed to send message');
//       return null;
//     }
//   };

//   // Send message via socket
//   const sendMessageSocket = (data) => {
//     if (!socket) return;
//     socket.emit('send_message', data, (response) => {
//       if (!response.success) {
//         toast.error(response.message || 'Failed to send message');
//       }
//     });
//   };

//   // Typing indicators
//   const sendTypingStart = (receiverId, chatId) => {
//     if (!socket) return;
//     socket.emit('typing_start', { receiverId, chatId });
//   };

//   const sendTypingStop = (receiverId, chatId) => {
//     if (!socket) return;
//     socket.emit('typing_stop', { receiverId, chatId });
//   };

//   // Mark message as read
//   const markMessageAsRead = async (messageId, chatId) => {
//     try {
//       await messageService.markAsRead({ messageId, chatId });
//     } catch (error) {
//       console.error('Failed to mark message as read');
//     }
//   };

//   // Create new chat
//   const createChat = async (participantId) => {
//     try {
//       const response = await chatService.getOrCreate(participantId);
//       if (response.success) {
//         setChats(prev => [response.data, ...prev]);
//         return response.data;
//       }
//     } catch (error) {
//       toast.error('Failed to create chat');
//       return null;
//     }
//   };

//   // Delete chat
//   const deleteChat = async (chatId) => {
//     try {
//       await chatService.delete(chatId);
//       setChats(prev => prev.filter(chat => chat._id !== chatId));
//       if (currentChat?._id === chatId) {
//         setCurrentChat(null);
//         setMessages([]);
//       }
//       toast.success('Chat deleted');
//     } catch (error) {
//       toast.error('Failed to delete chat');
//     }
//   };

//   const value = {
//     chats,
//     setChats,
//     currentChat,
//     setCurrentChat,
//     messages,
//     setMessages,
//     loading,
//     typingUsers,
//     loadChats,
//     loadMessages,
//     sendMessage,
//     sendMessageSocket,
//     sendTypingStart,
//     sendTypingStop,
//     markMessageAsRead,
//     createChat,
//     deleteChat,
//     isUserOnline,
//   };

//   return (
//     <ChatContext.Provider value={value}>
//       {children}
//     </ChatContext.Provider>
//   );
// };








import React, { createContext, useContext, useState, useEffect } from 'react'; 
import { chatService, messageService } from '../services/chat'; 
import { useAuth } from './AuthContext'; 
import { useSocket } from './SocketContext'; 
import toast from 'react-hot-toast'; 
 
const ChatContext = createContext(); 
 
export const useChat = () => useContext(ChatContext); 
 
export const ChatProvider = ({ children }) => { 
  const { user } = useAuth(); 
  const { socket, isUserOnline } = useSocket(); 
  const [chats, setChats] = useState([]); 
  const [currentChat, setCurrentChat] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [typingUsers, setTypingUsers] = useState({}); 
 
  // Load chats 
  const loadChats = async () => { 
    try { 
      setLoading(true); 
      const response = await chatService.getAll(); 
      if (response.success) { 
        setChats(response.data); 
      } 
    } catch (error) { 
      toast.error('Failed to load chats'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  useEffect(() => { 
    if (user) { 
      loadChats(); 
    } 
  }, [user]); 
 
  // Socket event listeners 
  useEffect(() => { 
    if (!socket) return; 
 
    // New message 
    socket.on('new_message', ({ message }) => { 
      console.log('📩 New message received:', message); 

      // Update messages state and chat list
      if (currentChat?._id === message.chatId) { 
        // Dedup: skip if message already in state (prevents duplicates when
        // pending messages are re-delivered as new_message after reconnect)
        setMessages(prev =>
          prev.some(m => m._id === message._id)
            ? prev
            : [...prev, message]
        ); 
      } 
 
      // Update chat list 
      setChats(prev => { 
        const updated = prev.map(chat => { 
          if (chat._id === message.chatId) { 
            return { 
              ...chat, 
              lastMessage: message, 
              lastMessageAt: message.createdAt, 
            }; 
          } 
          return chat; 
        }); 
 
        // Sort by lastMessageAt 
        return updated.sort((a, b) =>  
          new Date(b.lastMessageAt) - new Date(a.lastMessageAt) 
        ); 
      }); 
    }); 
 
    // Own message confirmation (sender's UI)
    socket.on('message_sent', ({ message }) => {
      if (currentChat?._id === message.chatId) {
        setMessages(prev =>
          prev.some(m => m._id === message._id)
            ? prev
            : [...prev, message]
        );
      }

      setChats(prev => {
        const updated = prev.map(chat =>
          chat._id === message.chatId
            ? { ...chat, lastMessage: message, lastMessageAt: message.createdAt }
            : chat
        );

        return updated.sort((a, b) =>
          new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
        );
      });
    });

    // Message status update 
    socket.on('message_status', ({ messageId, status }) => { 
      setMessages(prev => 
        prev.map(msg => 
          msg._id === messageId ? { ...msg, status } : msg 
        ) 
      ); 
    }); 
 
    // Typing events 
    socket.on('typing_start', ({ senderId, chatId }) => { 
      if (currentChat?._id === chatId) { 
        setTypingUsers(prev => ({ ...prev, [senderId]: true })); 
      } 
    }); 
 
    socket.on('typing_stop', ({ senderId, chatId }) => { 
      if (currentChat?._id === chatId) { 
        setTypingUsers(prev => ({ ...prev, [senderId]: false })); 
      } 
    }); 
 
    return () => { 
      socket.off('new_message'); 
      socket.off('message_sent'); 
      socket.off('message_status'); 
      socket.off('typing_start'); 
      socket.off('typing_stop'); 
    }; 
  }, [socket, currentChat]); 
 
  // Load messages for a chat 
  const loadMessages = async (chatId, page = 1) => { 
    try { 
      setLoading(true); 
      const response = await messageService.getMessages(chatId, page); 
      if (response.success) { 
        setMessages(response.data.messages || []); 
        return response.data; 
      } 
    } catch (error) { 
      toast.error('Failed to load messages'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  // Send message 
  const sendMessage = async (chatId, content, type = 'text') => { 
    try { 
      const response = await messageService.send({ 
        chatId, 
        content, 
        type, 
      }); 
 
      if (response.success) { 
        setMessages(prev => [...prev, response.data]); 
        return response.data; 
      } 
    } catch (error) { 
      toast.error('Failed to send message'); 
      return null; 
    } 
  }; 
 
  // Send message via socket 
  const sendMessageSocket = (data) => { 
    if (!socket) return; 
    socket.emit('send_message', data, (response) => { 
      if (!response.success) { 
        toast.error(response.message || 'Failed to send message'); 
      } 
    }); 
  }; 
 
  // Typing indicators 
  const sendTypingStart = (receiverId, chatId) => { 
    if (!socket) return; 
    socket.emit('typing_start', { receiverId, chatId }); 
  }; 
 
  const sendTypingStop = (receiverId, chatId) => { 
    if (!socket) return; 
    socket.emit('typing_stop', { receiverId, chatId }); 
  }; 
 
  // Mark message as read 
  // Emit via socket so the sender receives message_status "read" in real-time
  const markMessageAsRead = async (messageId, chatId) => { 
    if (socket) {
      socket.emit('message_read', { messageId, chatId });
      return;
    }

    try { 
      await messageService.markAsRead({ messageId, chatId }); 
    } catch (error) { 
      console.error('Failed to mark message as read'); 
    } 
  }; 
 
  // Create new chat 
  const createChat = async (participantId) => { 
    try { 
      const response = await chatService.getOrCreate(participantId); 
      if (response.success) { 
        setChats(prev => [response.data, ...prev]); 
        return response.data; 
      } 
    } catch (error) { 
      toast.error('Failed to create chat'); 
      return null; 
    } 
  }; 
 
  // Delete chat 
  const deleteChat = async (chatId) => { 
    try { 
      await chatService.delete(chatId); 
      setChats(prev => prev.filter(chat => chat._id !== chatId)); 
      if (currentChat?._id === chatId) { 
        setCurrentChat(null); 
        setMessages([]); 
      } 
      toast.success('Chat deleted'); 
    } catch (error) { 
      toast.error('Failed to delete chat'); 
    } 
  }; 
 
  const value = { 
    chats, 
    setChats, 
    currentChat, 
    setCurrentChat, 
    messages, 
    setMessages, 
    loading, 
    typingUsers, 
    loadChats, 
    loadMessages, 
    sendMessage, 
    sendMessageSocket, 
    sendTypingStart, 
    sendTypingStop, 
    markMessageAsRead, 
    createChat, 
    deleteChat, 
    isUserOnline, 
  }; 
 
  return ( 
    <ChatContext.Provider value={value}> 
      {children} 
    </ChatContext.Provider> 
  ); 
};