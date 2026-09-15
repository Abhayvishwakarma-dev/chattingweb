
import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { userService } from '../../services/user';
import { formatDistanceToNow } from 'date-fns';
import { FaSearch, FaPlus, FaUserPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const Sidebar = () => {
  const { user } = useAuth();

  const {
    chats,
    currentChat,
    setCurrentChat,
    loadMessages,
    createChat,
  } = useChat();

  const { isUserOnline } = useSocket();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // New chat state
  const [showNewChat, setShowNewChat] = useState(false);

  const [loading, setLoading] = useState(false);

  // =========================
  // SEARCH USERS
  // =========================
  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);

      const response = await userService.search(query);

      if (response.success) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DEBOUNCE SEARCH
  // =========================
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (showNewChat) {
        searchUsers(searchQuery);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery, showNewChat]);

  // =========================
  // START NEW CHAT
  // =========================
  const startChat = async (participantId) => {
    try {
      setLoading(true);

      const chat = await createChat(participantId);

      if (chat) {
        // Set current chat
        setCurrentChat(chat);

        // Load messages
        await loadMessages(chat._id);

        // Close new chat mode
        setShowNewChat(false);

        // Clear search
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Start chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLOSE NEW CHAT
  // =========================
  const closeNewChat = () => {
    setShowNewChat(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // =========================
  // LAST MESSAGE PREVIEW
  // =========================
  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) {
      return 'No messages yet';
    }

    const content = chat.lastMessage.content || '';

    return content.length > 30
      ? content.substring(0, 30) + '...'
      : content;
  };

  // =========================
  // TIME AGO
  // =========================
  const getTimeAgo = (date) => {
    if (!date) return '';

    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">

      {/* =========================
          HEADER
      ========================= */}
      <div className="p-4 bg-whatsapp-dark-green text-white">

        <div className="flex items-center justify-between">

          {/* User Info */}
          <div className="flex items-center space-x-3">

            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>

            <div>
              <p className="font-semibold">
                {user?.name}
              </p>

              <p className="text-xs opacity-75">
                Online
              </p>
            </div>

          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              if (showNewChat) {
                closeNewChat();
              } else {
                setShowNewChat(true);
              }
            }}
            className="hover:bg-white/20 p-2 rounded-full transition"
            title="New Chat"
          >
            {showNewChat ? (
              <IoMdClose className="text-2xl" />
            ) : (
              <FaPlus className="text-xl" />
            )}
          </button>

        </div>
      </div>


      {/* =========================
          SEARCH BAR
      ========================= */}
      <div className="p-3 border-b border-gray-200">

        <div className="relative">

          <input
            type="text"
            placeholder={
              showNewChat
                ? 'Search users...'
                : 'Search or start new chat'
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);

              // Automatically open new chat when typing
              if (!showNewChat) {
                setShowNewChat(true);
              }
            }}
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
          />

          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />

          {/* Clear Search */}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IoMdClose />
            </button>
          )}

        </div>
      </div>


      {/* =========================
          NEW CHAT / SEARCH RESULTS
      ========================= */}
      {showNewChat && (
        <div className="border-b border-gray-200">

          {/* Loading */}
          {loading && (
            <div className="p-3 text-center text-sm text-gray-500">
              Searching...
            </div>
          )}

          {/* Search Results */}
          {!loading && searchResults.length > 0 && (
            <div className="p-2 max-h-60 overflow-y-auto">

              <p className="text-xs text-gray-500 px-2 py-1">
                Search Results
              </p>

              {searchResults.map((result) => (

                <button
                  key={result._id}
                  onClick={() => startChat(result._id)}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
                >

                  {/* Avatar */}
                  {result.profileImage ? (

                    <img
                      src={result.profileImage}
                      alt={result.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                  ) : (

                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">

                      <span className="text-white font-semibold">
                        {result.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>

                    </div>

                  )}

                  {/* User Info */}
                  <div className="flex-1 text-left">

                    <p className="font-medium text-gray-800">
                      {result.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {result.email || result.phone}
                    </p>

                  </div>

                  {/* Add User Icon */}
                  <FaUserPlus className="text-whatsapp-green" />

                </button>

              ))}

            </div>
          )}

          {/* No Results */}
          {!loading &&
            searchQuery.length >= 2 &&
            searchResults.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No users found
              </div>
            )}

          {/* Initial New Chat Message */}
          {!loading &&
            searchQuery.length < 2 && (
              <div className="p-4 text-center text-sm text-gray-500">
                Search by name, email or phone
              </div>
            )}

        </div>
      )}


      {/* =========================
          CHAT LIST
      ========================= */}
      <div className="flex-1 overflow-y-auto">

        {chats.length === 0 ? (

          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">

            <FaPlus className="text-4xl mb-2 opacity-50" />

            <p className="text-sm">
              No conversations yet
            </p>

            <p className="text-xs">
              Start a new chat to begin
            </p>

          </div>

        ) : (

          chats.map((chat) => {

            const otherParticipant =
              chat.otherParticipant ||
              chat.participants?.find(
                (p) => p._id !== user?._id
              );

            const isOnline = isUserOnline(
              otherParticipant?._id
            );

            return (

              <button
                key={chat._id}
                onClick={async () => {
                  setCurrentChat(chat);
                  await loadMessages(chat._id);
                }}
                className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition border-b border-gray-100 ${
                  currentChat?._id === chat._id
                    ? 'bg-gray-100'
                    : ''
                }`}
              >

                {/* =========================
                    AVATAR
                ========================= */}
                <div className="relative">

                  {otherParticipant?.profileImage ? (

                    <img
                      src={otherParticipant.profileImage}
                      alt={otherParticipant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                  ) : (

                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">

                      <span className="text-white font-semibold text-lg">
                        {otherParticipant?.name
                          ?.charAt(0)
                          ?.toUpperCase() || 'U'}
                      </span>

                    </div>

                  )}

                  {/* Online Indicator */}
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}

                </div>


                {/* =========================
                    CHAT CONTENT
                ========================= */}
                <div className="flex-1 text-left min-w-0">

                  <div className="flex items-center justify-between">

                    <p className="font-medium text-gray-800 truncate">
                      {otherParticipant?.name || 'Unknown User'}
                    </p>

                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {getTimeAgo(chat.lastMessageAt)}
                    </span>

                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    {getLastMessagePreview(chat)}
                  </p>

                </div>

              </button>

            );
          })

        )}

      </div>

    </div>
  );
};

export default Sidebar;
