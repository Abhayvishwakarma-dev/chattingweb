// src/components/chat/SearchUsers.jsx
import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { userService } from '../../services/user';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const SearchUsers = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createChat } = useChat();

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await userService.search(query);
        if (response.success) {
          setResults(response.data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(search, 500);
    return () => clearTimeout(delay);
  }, [query]);

  const handleAddUser = async (userId) => {
    const chat = await createChat(userId);
    if (chat) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">New Chat</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
            </div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <p className="text-center text-gray-500 p-4">No users found</p>
          )}

          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-whatsapp-green flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email || user.phone}</p>
                </div>
              </div>
              <button
                onClick={() => handleAddUser(user._id)}
                className="bg-whatsapp-green text-white p-2 rounded-full hover:bg-whatsapp-dark-green transition"
              >
                <FaUserPlus />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;