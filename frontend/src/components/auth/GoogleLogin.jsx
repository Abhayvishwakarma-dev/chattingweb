import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
    >
      <FcGoogle className="text-2xl" />
      <span className="font-medium text-gray-700">Continue with Google</span>
    </button>
  );
};

export default GoogleLogin;