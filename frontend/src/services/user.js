import api from './api';

export const userService = {
  /**
   * Get all users except current user
   * @returns {Promise} List of all users with online status
   */
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} User details
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} data - Updated user data
   * @param {string} data.name - User name
   * @param {string} data.about - User about/bio
   * @param {string} data.profileImage - Profile image URL
   * @param {string} data.phone - Phone number
   * @returns {Promise} Updated user data
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  /**
   * Search users by name, email, or phone
   * @param {string} query - Search query (minimum 2 characters)
   * @returns {Promise} List of matching users
   */
  search: async (query) => {
    try {
      if (!query || query.length < 2) {
        return { success: true, data: [] };
      }
      const response = await api.get(`/users/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  },

  /**
   * Get user's online status
   * @param {string} id - User ID
   * @returns {Promise} User status (online, lastSeen)
   */
  getStatus: async (id) => {
    try {
      const response = await api.get(`/users/${id}/status`);
      return response.data;
    } catch (error) {
      console.error('Get user status error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} Current user data
   */
  getMyProfile: async () => {
    try {
      const response = await api.get('/users/me/profile');
      return response.data;
    } catch (error) {
      console.error('Get my profile error:', error);
      throw error;
    }
  },

  /**
   * Get multiple users by IDs
   * @param {string[]} ids - Array of user IDs
   * @returns {Promise} List of users
   */
  getMultiple: async (ids) => {
    try {
      if (!ids || ids.length === 0) {
        return { success: true, data: [] };
      }
      // Since we don't have a bulk endpoint, fetch one by one
      const promises = ids.map(id => api.get(`/users/${id}`));
      const responses = await Promise.all(promises);
      const data = responses.map(res => res.data.data);
      return { success: true, data };
    } catch (error) {
      console.error('Get multiple users error:', error);
      throw error;
    }
  },

  /**
   * Update user's online status (used by socket)
   * @param {string} id - User ID
   * @param {boolean} isOnline - Online status
   * @returns {Promise} Updated user
   */
  updateStatus: async (id, isOnline) => {
    try {
      // This would typically be handled by socket
      // But we keep it for HTTP fallback
      const response = await api.put(`/users/${id}`, { isOnline });
      return response.data;
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  },

  /**
   * Get user's profile image
   * @param {string} id - User ID
   * @returns {string} Profile image URL or default avatar
   */
  getProfileImage: (user) => {
    if (!user) return '';
    if (user.profileImage) return user.profileImage;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=random&size=128`;
  },

  /**
   * Get user's initials for avatar
   * @param {string} name - User name
   * @returns {string} Initials (max 2 characters)
   */
  getInitials: (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  },

  /**
   * Format user for display
   * @param {Object} user - User object
   * @returns {Object} Formatted user object
   */
  formatUser: (user) => {
    if (!user) return null;
    return {
      ...user,
      displayName: user.name || 'Unknown User',
      displayImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=random&size=128`,
      initials: userService.getInitials(user.name),
      isOnline: user.isOnline || false,
      lastSeenFormatted: user.lastSeen ? new Date(user.lastSeen).toLocaleString() : null,
    };
  },

  /**
   * Check if user is online (from socket status)
   * @param {string} userId - User ID
   * @param {string[]} onlineUsers - Array of online user IDs
   * @returns {boolean} True if user is online
   */
  isUserOnline: (userId, onlineUsers) => {
    if (!userId || !onlineUsers) return false;
    return onlineUsers.includes(userId);
  },

  /**
   * Get user's display status
   * @param {Object} user - User object
   * @param {string[]} onlineUsers - Array of online user IDs
   * @returns {string} Status text (Online, Offline, Last seen...)
   */
  getDisplayStatus: (user, onlineUsers) => {
    if (!user) return 'Offline';
    const isOnline = userService.isUserOnline(user._id, onlineUsers);
    if (isOnline) return 'Online';
    if (user.lastSeen) {
      const lastSeen = new Date(user.lastSeen);
      const now = new Date();
      const diff = now - lastSeen;
      
      // Less than 1 minute
      if (diff < 60000) return 'Last seen just now';
      // Less than 1 hour
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `Last seen ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      // Less than 24 hours
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `Last seen ${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      // More than 24 hours
      return `Last seen ${lastSeen.toLocaleDateString()}`;
    }
    return 'Offline';
  },
};

export default userService;