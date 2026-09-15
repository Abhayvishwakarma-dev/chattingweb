import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Spinner from '../common/Spinner';
import { FaBars, FaTimes } from 'react-icons/fa';

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const { currentChat } = useChat();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Close sidebar on mobile when chat is selected
  useEffect(() => {
    if (isMobile && currentChat) {
      setIsSidebarOpen(false);
    }
  }, [currentChat, isMobile]);

  if (loading) {
    return <Spinner fullScreen size="xl" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Toggle Button - Mobile */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed bottom-6 right-6 z-50 bg-whatsapp-green text-white p-4 rounded-full shadow-lg hover:bg-whatsapp-dark-green transition-all duration-200 hover:scale-105"
          >
            {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        )}

        {/* Sidebar Overlay - Mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'relative w-80'}
            transition-transform duration-300 ease-in-out
            bg-white border-r border-gray-200 shadow-xl
            flex-shrink-0
          `}
        >
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {currentChat ? (
            <Outlet />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4">
              {/* WhatsApp Logo */}
              <div className="w-24 h-24 bg-whatsapp-green/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-whatsapp-green"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                WhatsApp Web
              </h3>
              
              <p className="text-sm text-center max-w-sm">
                Select a conversation to start chatting or create a new one
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mt-6 max-w-md w-full">
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-2xl mb-1">💬</div>
                  <p className="text-xs text-gray-500">Real-time messages</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs text-gray-500">End-to-end encrypted</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;