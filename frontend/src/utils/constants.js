// ============================================
// API Constants
// ============================================

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// ============================================
// Message Types
// ============================================

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  LOCATION: 'location',
  CONTACT: 'contact',
};

// ============================================
// Message Status
// ============================================

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
  PENDING: 'pending',
};

// ============================================
// Chat Types
// ============================================

export const CHAT_TYPES = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
  BROADCAST: 'broadcast',
};

// ============================================
// User Roles
// ============================================

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// ============================================
// Auth Providers
// ============================================

export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
};

// ============================================
// Routes
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHAT: '/chat',
  CHAT_ID: '/chat/:id',
  NOT_FOUND: '/404',
  GOOGLE_SUCCESS: '/google-success',
};

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'Access denied. You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  TOKEN_INVALID: 'Invalid token. Please login again.',
  TOKEN_EXPIRED: 'Token expired. Please login again.',
  GOOGLE_AUTH_FAILED: 'Google authentication failed. Please try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  LOGOUT_FAILED: 'Logout failed. Please try again.',
  MESSAGE_SEND_FAILED: 'Failed to send message. Please try again.',
  MESSAGE_LOAD_FAILED: 'Failed to load messages. Please try again.',
  CHAT_CREATE_FAILED: 'Failed to create chat. Please try again.',
  USER_LOAD_FAILED: 'Failed to load user data. Please try again.',
  PROFILE_UPDATE_FAILED: 'Failed to update profile. Please try again.',
};

// ============================================
// Success Messages
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Welcome back.',
  REGISTRATION_SUCCESS: 'Registration successful! Welcome to WhatsApp.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully.',
  MESSAGE_SEND_SUCCESS: 'Message sent successfully.',
  CHAT_CREATE_SUCCESS: 'Chat created successfully.',
  CHAT_DELETE_SUCCESS: 'Chat deleted successfully.',
  MESSAGE_DELETE_SUCCESS: 'Message deleted successfully.',
};

// ============================================
// Validation Constants
// ============================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_ABOUT_LENGTH: 150,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

// ============================================
// Date Formats
// ============================================

export const DATE_FORMATS = {
  FULL: 'MMMM d, yyyy h:mm a',
  SHORT: 'MMM d, yyyy',
  TIME: 'h:mm a',
  DATE_TIME: 'MMM d, h:mm a',
  CHAT_DATE: 'dd/MM/yyyy',
  CHAT_TIME: 'hh:mm a',
  MESSAGE_DATE: 'MMM d, yyyy h:mm a',
  LAST_SEEN: 'Last seen MMM d, yyyy h:mm a',
  TIME_AGO: 'timeAgo',
};

// ============================================
// Theme Constants
// ============================================

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const COLORS = {
  WHATSAPP_GREEN: '#25D366',
  WHATSAPP_DARK_GREEN: '#128C7E',
  WHATSAPP_LIGHT: '#DCF8C6',
  WHATSAPP_BG: '#ECE5DD',
  WHATSAPP_BLUE: '#34B7F1',
  PRIMARY: '#25D366',
  SECONDARY: '#128C7E',
  SUCCESS: '#4CAF50',
  DANGER: '#F44336',
  WARNING: '#FF9800',
  INFO: '#2196F3',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_100: '#F5F5F5',
  GRAY_200: '#E5E5E5',
  GRAY_300: '#D4D4D4',
  GRAY_400: '#A3A3A3',
  GRAY_500: '#737373',
  GRAY_600: '#525252',
  GRAY_700: '#404040',
  GRAY_800: '#262626',
  GRAY_900: '#171717',
};

// ============================================
// Pagination Defaults
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// ============================================
// Socket Events
// ============================================

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  RECONNECTING: 'reconnecting',
  CONNECT_ERROR: 'connect_error',

  // Presence
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  ONLINE_USERS: 'online_users',

  // Messages
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_STATUS: 'message_status',
  MESSAGE_READ: 'message_read',
  MESSAGE_DELIVERED: 'message_delivered',

  // Typing
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',

  // Read Receipts
  READ_RECEIPT: 'read_receipt',
  DELIVERED_RECEIPT: 'delivered_receipt',

  // Errors
  ERROR: 'error',
};

// ============================================
// File Upload Presets
// ============================================

export const UPLOAD_PRESETS = {
  AVATAR: 'avatar',
  MESSAGE_IMAGE: 'message_image',
  MESSAGE_VIDEO: 'message_video',
  MESSAGE_DOCUMENT: 'message_document',
  MESSAGE_AUDIO: 'message_audio',
};

// ============================================
// Default Values
// ============================================

export const DEFAULTS = {
  ABOUT: 'Hey there! I am using WhatsApp.',
  AVATAR_COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF6B6B', '#4ECDC4'],
  GROUP_AVATAR: '👥',
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_THEME: 'light',
  MAX_RECENT_SEARCHES: 10,
  MAX_CHAT_PREVIEW_LENGTH: 30,
  TYPING_TIMEOUT: 2000,
  RECONNECT_ATTEMPTS: Infinity,
  RECONNECT_DELAY: 1000,
  RECONNECT_DELAY_MAX: 5000,
};

// ============================================
// Export All
// ============================================

export default {
  API_URL,
  SOCKET_URL,
  STORAGE_KEYS,
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  CHAT_TYPES,
  USER_ROLES,
  AUTH_PROVIDERS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  DATE_FORMATS,
  THEMES,
  COLORS,
  PAGINATION,
  SOCKET_EVENTS,
  UPLOAD_PRESETS,
  DEFAULTS,
};