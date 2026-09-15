import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { formatDistanceToNow } from 'date-fns';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const ChatList = ({ onSelectChat }) => {
  const { user } = useAuth();
  const { chats, currentChat, setCurrentChat, loadMessages } = useChat();
  const { isUserOnline } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const otherParticipant = chat.otherParticipant || 
      chat.participants?.find(p => p._id !== user?._id);
    return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    const content = chat.lastMessage.content || '';
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    loadMessages(chat._id);
    if (onSelectChat) onSelectChat(chat);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-whatsapp-dark-green text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-xs opacity-75">Online</p>
            </div>
          </div>
          <button className="hover:bg-white/20 p-2 rounded-full transition">
            <FaUserPlus className="text-xl" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new chat to begin</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherParticipant = chat.otherParticipant || 
              chat.participants?.find(p => p._id !== user?._id);
            const isOnline = isUserOnline(otherParticipant?._id);

            return (
              <button
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition border-b border-gray-100 ${
                  currentChat?._id === chat._id ? 'bg-gray-100' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {otherParticipant?.profileImage ? (
                    <img
                      src={otherParticipant.profileImage}
                      alt={otherParticipant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {otherParticipant?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800 truncate">
                      {otherParticipant?.name || 'Unknown User'}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {getTimeAgo(chat.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">
                      {getLastMessagePreview(chat)}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-whatsapp-green text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;