import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context value
 * @property {Object} user - Current user data
 * @property {Function} setUser - Update user data
 * @property {boolean} loading - Auth loading state
 * @property {boolean} isAuthenticated - User authentication status
 * @property {Function} login - Login function
 * @property {Function} register - Register function
 * @property {Function} logout - Logout function
 * @property {Function} updateUser - Update user in context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;