import { formatDistanceToNow, format } from 'date-fns';
import { DATE_FORMATS, DEFAULTS, COLORS } from './constants';

// ============================================
// String Helpers
// ============================================

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 30) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Capitalize first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate a random color from predefined colors
 * @param {string} seed - Seed for consistent color
 * @returns {string} Hex color code
 */
export const getAvatarColor = (seed = '') => {
  const colors = DEFAULTS.AVATAR_COLORS;
  if (!seed) return colors[Math.floor(Math.random() * colors.length)];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Generate avatar URL
 * @param {string} name - User name
 * @param {string} imageUrl - Profile image URL
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (name, imageUrl = null) => {
  if (imageUrl) return imageUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=random&size=128`;
};

// ============================================
// Date Helpers
// ============================================

/**
 * Format a date relative to now
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const getTimeAgo = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date to a specific format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DATE_TIME) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Check if a date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear();
  } catch (error) {
    console.error('Error checking date:', error);
    return false;
  }
};

/**
 * Check if a date is yesterday
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateObj.getDate() === yesterday.getDate() &&
           dateObj.getMonth() === yesterday.getMonth() &&
           dateObj.getFullYear() === yesterday.getFullYear();
  } catch (error) {
    console.error('Error checking date:', error);
    return false;
  }
};

/**
 * Get message date label (Today, Yesterday, or formatted date)
 * @param {string|Date} date - Date to format
 * @returns {string} Date label
 */
export const getMessageDateLabel = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isToday(dateObj)) return 'Today';
    if (isYesterday(dateObj)) return 'Yesterday';
    return formatDate(dateObj, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date label:', error);
    return '';
  }
};

// ============================================
// Chat Helpers
// ============================================

/**
 * Get the other participant in a chat
 * @param {Object} chat - Chat object
 * @param {string} userId - Current user ID
 * @returns {Object} Other participant
 */
export const getOtherParticipant = (chat, userId) => {
  if (!chat || !chat.participants) return null;
  return chat.participants.find(p => p._id !== userId) || chat.otherParticipant || null;
};

/**
 * Get chat display name
 * @param {Object} chat - Chat object
 * @param {string} userId - Current user ID
 * @returns {string} Display name
 */
export const getChatDisplayName = (chat, userId) => {
  if (!chat) return 'Unknown Chat';
  if (chat.isGroupChat) {
    return chat.groupName || 'Group Chat';
  }
  const other = getOtherParticipant(chat, userId);
  return other?.name || 'Unknown User';
};

/**
 * Get chat avatar
 * @param {Object} chat - Chat object
 * @param {string} userId - Current user ID
 * @returns {string} Avatar URL
 */
export const getChatAvatar = (chat, userId) => {
  if (!chat) return '';
  if (chat.isGroupChat) {
    return chat.groupAvatar || DEFAULTS.GROUP_AVATAR;
  }
  const other = getOtherParticipant(chat, userId);
  return getAvatarUrl(other?.name, other?.profileImage);
};

/**
 * Get last message preview
 * @param {Object} chat - Chat object
 * @param {number} maxLength - Maximum preview length
 * @returns {string} Message preview
 */
export const getLastMessagePreview = (chat, maxLength = 30) => {
  if (!chat || !chat.lastMessage) return 'No messages yet';
  const content = chat.lastMessage.content || '';
  return truncateString(content, maxLength);
};

// ============================================
// Message Helpers
// ============================================

/**
 * Check if a message is from the current user
 * @param {Object} message - Message object
 * @param {string} userId - Current user ID
 * @returns {boolean} True if message is from current user
 */
export const isOwnMessage = (message, userId) => {
  if (!message || !userId) return false;
  return message.senderId?._id === userId || message.senderId === userId;
};

/**
 * Get message status icon
 * @param {string} status - Message status
 * @param {boolean} isOwn - Is message from current user
 * @returns {Object} Status icon config
 */
export const getMessageStatusIcon = (status, isOwn) => {
  if (!isOwn) return null;
  
  switch (status) {
    case 'sent':
      return { icon: '✓', color: 'text-gray-400' };
    case 'delivered':
      return { icon: '✓✓', color: 'text-gray-400' };
    case 'read':
      return { icon: '✓✓', color: 'text-blue-500' };
    default:
      return null;
  }
};

// ============================================
// File Helpers
// ============================================

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type icon
 * @param {string} mimeType - MIME type
 * @returns {string} Icon name
 */
export const getFileTypeIcon = (mimeType) => {
  if (!mimeType) return 'file';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word')) return 'word';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'powerpoint';
  if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') return 'zip';
  return 'file';
};

// ============================================
// Validation Helpers
// ============================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
  const regex = /^[0-9]{10,15}$/;
  return regex.test(phone.replace(/[^0-9]/g, ''));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const result = {
    valid: true,
    errors: [],
    score: 0,
  };

  if (password.length < 6) {
    result.valid = false;
    result.errors.push('Password must be at least 6 characters');
  }

  if (password.length > 50) {
    result.valid = false;
    result.errors.push('Password must be less than 50 characters');
  }

  // Calculate score
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  result.score = score;

  return result;
};

// ============================================
// URL Helpers
// ============================================

/**
 * Get URL parameters
 * @returns {Object} URL parameters
 */
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} Full URL
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
};

// ============================================
// Device Helpers
// ============================================

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile
 */
export const isMobile = () => {
  return window.innerWidth < 768;
};

/**
 * Check if device is tablet
 * @returns {boolean} True if tablet
 */
export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Check if device is desktop
 * @returns {boolean} True if desktop
 */
export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

/**
 * Get device type
 * @returns {string} Device type
 */
export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

// ============================================
// DOM Helpers
// ============================================

/**
 * Scroll to bottom of an element
 * @param {HTMLElement} element - DOM element
 */
export const scrollToBottom = (element) => {
  if (!element) return;
  requestAnimationFrame(() => {
    element.scrollTop = element.scrollHeight;
  });
};

/**
 * Focus an input element
 * @param {HTMLElement} element - DOM element
 */
export const focusInput = (element) => {
  if (!element) return;
  setTimeout(() => {
    element.focus();
  }, 100);
};

// ============================================
// Copy to Clipboard
// ============================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy to clipboard error:', error);
    return false;
  }
};

// ============================================
// Export All
// ============================================

export default {
  truncateString,
  capitalizeFirstLetter,
  getInitials,
  getAvatarColor,
  getAvatarUrl,
  getTimeAgo,
  formatDate,
  isToday,
  isYesterday,
  getMessageDateLabel,
  getOtherParticipant,
  getChatDisplayName,
  getChatAvatar,
  getLastMessagePreview,
  isOwnMessage,
  getMessageStatusIcon,
  formatFileSize,
  getFileTypeIcon,
  isValidEmail,
  isValidPhone,
  validatePassword,
  getUrlParams,
  buildUrl,
  isMobile,
  isTablet,
  isDesktop,
  getDeviceType,
  scrollToBottom,
  focusInput,
  copyToClipboard,
};