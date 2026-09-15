import React from 'react';
import { Outlet } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-whatsapp-green to-whatsapp-dark-green text-white flex-col items-center justify-center p-12">
        <div className="max-w-md text-center">
          <FaWhatsapp className="text-8xl mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">Welcome to WhatsApp</h1>
          <p className="text-lg opacity-90 mb-6">
            Connect with your friends and family instantly. Secure, reliable, and fast messaging.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">💬</div>
              <p>Real-time messaging</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">🔒</div>
              <p>End-to-end encrypted</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">🌐</div>
              <p>Available everywhere</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <p>Cross-platform sync</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Auth Footer Component
export const AuthFooter = () => {
  return (
    <div className="mt-8 text-center text-xs text-gray-400">
      <p>By continuing, you agree to our</p>
      <p>
        <a href="#" className="text-whatsapp-green hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-whatsapp-green hover:underline">Privacy Policy</a>
      </p>
    </div>
  );
};

export default AuthLayout;