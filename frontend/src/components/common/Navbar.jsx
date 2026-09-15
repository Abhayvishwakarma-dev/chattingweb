import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { FaSearch, FaUser, FaSignOutAlt, FaCog, FaWhatsapp } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-whatsapp-dark-green text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <FaWhatsapp className="text-2xl" />
            <span className="text-xl font-semibold hidden sm:block">WhatsApp</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs hidden sm:inline">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-4 py-2 pl-10 bg-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {/* Profile Button */}
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-lg transition"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <span className="hidden md:block text-sm font-medium">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden hover:bg-white/10 p-2 rounded-lg transition"
            >
              <IoMdMenu className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden bg-whatsapp-dark-green border-t border-white/10 px-4 py-3">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 bg-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="absolute right-4 top-16 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-whatsapp-green flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email || user?.phone}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition"
          >
            <FaUser className="text-gray-500" />
            <span className="text-gray-700">Profile</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition"
          >
            <FaCog className="text-gray-500" />
            <span className="text-gray-700">Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition border-t border-gray-100"
          >
            <FaSignOutAlt className="text-red-500" />
            <span className="text-red-500 font-medium">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;