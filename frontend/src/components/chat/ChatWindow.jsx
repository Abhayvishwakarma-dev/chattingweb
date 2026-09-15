// import React, { useEffect, useRef, useState } from 'react';
// import { useChat } from '../../context/ChatContext';
// import { useAuth } from '../../context/AuthContext';
// import { useSocket } from '../../context/SocketContext';
// import MessageBubble from './MessageBubble';
// import MessageInput from './MessageInput';
// import TypingIndicator from './TypingIndicator';
// import { FaArrowLeft, FaPhone, FaVideo, FaEllipsisV, FaPaperclip } from 'react-icons/fa';
// import { format } from 'date-fns';

// const ChatWindow = () => {
//   const { user } = useAuth();
//   const {
//     currentChat,
//     messages,
//     loading,
//     typingUsers,
//     loadMessages,
//     markMessageAsRead,
//   } = useChat();
//   const { isUserOnline } = useSocket();
//   const [showOptions, setShowOptions] = useState(false);
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);

//   const otherParticipant = currentChat?.otherParticipant || 
//     currentChat?.participants?.find(p => p._id !== user?._id);

//   const isOnline = isUserOnline(otherParticipant?._id);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Mark messages as read when chat opens
//   useEffect(() => {
//     if (currentChat && messages.length > 0) {
//       const unreadMessages = messages.filter(
//         msg => msg.receiverId?._id === user?._id && msg.status !== 'read'
//       );
//       unreadMessages.forEach(msg => {
//         markMessageAsRead(msg._id, currentChat._id);
//       });
//     }
//   }, [currentChat, messages, user, markMessageAsRead]);

//   // Group messages by date
//   const groupMessagesByDate = (messages) => {
//     const groups = {};
//     messages.forEach(message => {
//       const date = format(new Date(message.createdAt), 'yyyy-MM-dd');
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(message);
//     });
//     return groups;
//   };

//   const getDateLabel = (date) => {
//     const today = format(new Date(), 'yyyy-MM-dd');
//     const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
    
//     if (date === today) return 'Today';
//     if (date === yesterday) return 'Yesterday';
//     return format(new Date(date), 'MMMM d, yyyy');
//   };

//   if (!currentChat) {
//     return null;
//   }

//   return (
//     <div className="flex-1 flex flex-col h-full bg-gray-50">
//       {/* Chat Header */}
//       <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm">
//         <div className="flex items-center space-x-3">
//           <button 
//             onClick={() => window.history.back()}
//             className="md:hidden hover:bg-gray-100 p-2 rounded-full transition"
//           >
//             <FaArrowLeft />
//           </button>
          
//           <div className="relative">
//             {otherParticipant?.profileImage ? (
//               <img
//                 src={otherParticipant.profileImage}
//                 alt={otherParticipant.name}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
//                 <span className="text-white font-semibold text-lg">
//                   {otherParticipant?.name?.charAt(0)?.toUpperCase() || 'U'}
//                 </span>
//               </div>
//             )}
//             {isOnline && (
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//             )}
//           </div>
          
//           <div>
//             <p className="font-semibold text-gray-800">{otherParticipant?.name}</p>
//             <p className="text-xs text-gray-500">
//               {isOnline ? 'Online' : 'Last seen recently'}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <button className="hover:bg-gray-100 p-2 rounded-full transition">
//             <FaPhone className="text-gray-600" />
//           </button>
//           <button className="hover:bg-gray-100 p-2 rounded-full transition hidden sm:block">
//             <FaVideo className="text-gray-600" />
//           </button>
//           <button className="hover:bg-gray-100 p-2 rounded-full transition hidden sm:block">
//             <FaPaperclip className="text-gray-600" />
//           </button>
//           <button 
//             onClick={() => setShowOptions(!showOptions)}
//             className="hover:bg-gray-100 p-2 rounded-full transition relative"
//           >
//             <FaEllipsisV className="text-gray-600" />
//             {showOptions && (
//               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
//                 <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
//                   View Profile
//                 </button>
//                 <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
//                   Search Messages
//                 </button>
//                 <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-500">
//                   Clear Chat
//                 </button>
//               </div>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div 
//         ref={chatContainerRef}
//         className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD]"
//       >
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-gray-500">
//             <p className="text-lg">No messages yet</p>
//             <p className="text-sm">Say hello to start chatting!</p>
//           </div>
//         ) : (
//           <>
//             {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
//               <div key={date}>
//                 <div className="flex justify-center my-4">
//                   <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
//                     {getDateLabel(date)}
//                   </span>
//                 </div>
//                 {msgs.map((message) => (
//                   <MessageBubble
//                     key={message._id}
//                     message={message}
//                     isOwn={message.senderId?._id === user?._id}
//                   />
//                 ))}
//               </div>
//             ))}
//           </>
//         )}
        
//         {/* Typing Indicator */}
//         {Object.keys(typingUsers).some(id => typingUsers[id]) && (
//           <TypingIndicator />
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <MessageInput />
//     </div>
//   );
// };

// export default ChatWindow;






import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import {
  FaArrowLeft,
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaPaperclip,
} from 'react-icons/fa';
import { format } from 'date-fns';

const ChatWindow = () => {
  const { user } = useAuth();

  const {
    currentChat,
    messages,
    loading,
    typingUsers,
    markMessageAsRead,
  } = useChat();

  const { isUserOnline } = useSocket();

  const [showOptions, setShowOptions] = useState(false);

  const messagesEndRef = useRef(null);

  // ==========================================
  // OTHER PARTICIPANT
  // ==========================================
  const otherParticipant =
    currentChat?.otherParticipant ||
    currentChat?.participants?.find(
      (p) => p._id !== user?._id
    );

  const isOnline = isUserOnline(otherParticipant?._id);

  // ==========================================
  // SCROLL TO BOTTOM
  // ==========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, typingUsers]);

  // ==========================================
  // MARK MESSAGES AS READ
  // ==========================================
  useEffect(() => {
    if (!currentChat || !messages.length || !user?._id) {
      return;
    }

    const unreadMessages = messages.filter(
      (msg) =>
        msg.receiverId?._id === user._id &&
        msg.status !== 'read'
    );

    unreadMessages.forEach((msg) => {
      markMessageAsRead(msg._id, currentChat._id);
    });
  }, [
    currentChat,
    messages,
    user?._id,
    markMessageAsRead,
  ]);

  // ==========================================
  // GROUP MESSAGES BY DATE
  // ==========================================
  const groupMessagesByDate = (messageList) => {
    const groups = {};

    messageList.forEach((message) => {
      const date = format(
        new Date(message.createdAt),
        'yyyy-MM-dd'
      );

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(message);
    });

    return groups;
  };

  // ==========================================
  // DATE LABEL
  // ==========================================
  const getDateLabel = (date) => {
    const today = format(
      new Date(),
      'yyyy-MM-dd'
    );

    const yesterday = format(
      new Date(Date.now() - 86400000),
      'yyyy-MM-dd'
    );

    if (date === today) {
      return 'Today';
    }

    if (date === yesterday) {
      return 'Yesterday';
    }

    return format(
      new Date(date),
      'MMMM d, yyyy'
    );
  };

  // ==========================================
  // NO CHAT SELECTED
  // ==========================================
  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p className="text-xl font-semibold">
            Welcome to Chat
          </p>

          <p className="text-sm mt-2">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">

      {/* ==========================================
          CHAT HEADER
      ========================================== */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm">

        {/* LEFT SIDE */}
        <div className="flex items-center space-x-3">

          {/* Mobile Back */}
          <button
            onClick={() => window.history.back()}
            className="md:hidden hover:bg-gray-100 p-2 rounded-full transition"
          >
            <FaArrowLeft />
          </button>

          {/* Avatar */}
          <div className="relative">

            {otherParticipant?.profileImage ? (
              <img
                src={otherParticipant.profileImage}
                alt={otherParticipant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {otherParticipant?.name
                    ?.charAt(0)
                    ?.toUpperCase() || 'U'}
                </span>
              </div>
            )}

            {/* Online Indicator */}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}

          </div>

          {/* User Name */}
          <div>
            <p className="font-semibold text-gray-800">
              {otherParticipant?.name || 'Unknown User'}
            </p>

            <p className="text-xs text-gray-500">
              {isOnline
                ? 'Online'
                : 'Last seen recently'}
            </p>
          </div>

        </div>

        {/* ==========================================
            HEADER ACTIONS
        ========================================== */}
        <div className="flex items-center space-x-2">

          <button
            className="hover:bg-gray-100 p-2 rounded-full transition"
            title="Call"
          >
            <FaPhone className="text-gray-600" />
          </button>

          <button
            className="hover:bg-gray-100 p-2 rounded-full transition hidden sm:block"
            title="Video Call"
          >
            <FaVideo className="text-gray-600" />
          </button>

          <button
            className="hover:bg-gray-100 p-2 rounded-full transition hidden sm:block"
            title="Attach"
          >
            <FaPaperclip className="text-gray-600" />
          </button>

          {/* More Options */}
          <div className="relative">

            <button
              onClick={() =>
                setShowOptions(!showOptions)
              }
              className="hover:bg-gray-100 p-2 rounded-full transition"
            >
              <FaEllipsisV className="text-gray-600" />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">

                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                  View Profile
                </button>

                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                  Search Messages
                </button>

                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-500">
                  Clear Chat
                </button>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* ==========================================
          MESSAGES AREA
      ========================================== */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD]">

        {/* Loading */}
        {loading ? (

          <div className="flex items-center justify-center h-full">

            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green" />

          </div>

        ) : messages.length === 0 ? (

          /* No Messages */
          <div className="flex flex-col items-center justify-center h-full text-gray-500">

            <p className="text-lg">
              No messages yet
            </p>

            <p className="text-sm">
              Say hello to start chatting!
            </p>

          </div>

        ) : (

          /* Messages */
          <>
            {Object.entries(
              groupMessagesByDate(messages)
            ).map(([date, msgs]) => (

              <div key={date}>

                {/* Date */}
                <div className="flex justify-center my-4">

                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {getDateLabel(date)}
                  </span>

                </div>

                {/* Messages */}
                {msgs.map((message) => (

                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={
                      message.senderId?._id ===
                      user?._id
                    }
                  />

                ))}

              </div>

            ))}
          </>

        )}

        {/* ==========================================
            TYPING INDICATOR
        ========================================== */}
        {Object.keys(typingUsers).some(
          (id) => typingUsers[id]
        ) && <TypingIndicator />}

        {/* Scroll Reference */}
        <div ref={messagesEndRef} />

      </div>

      {/* ==========================================
          MESSAGE INPUT
      ========================================== */}
      <MessageInput />

    </div>
  );
};

export default ChatWindow;
