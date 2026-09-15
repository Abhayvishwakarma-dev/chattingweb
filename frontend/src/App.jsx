import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import GoogleSuccess from './components/auth/GoogleSuccess';

// Chat Pages
import ChatWindow from './components/chat/ChatWindow';

import ProfileEdit from './components/profile/ProfileEdit';

// Inside Routes:
<Route path="/profile" element={<ProfileEdit />} />

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Auth Redirects */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />

            {/* Google Success */}
            <Route path="/google-success" element={<GoogleSuccess />} />

            {/* Main App */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/chat" replace />} />
              <Route path="chat" element={<ChatWindow />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;