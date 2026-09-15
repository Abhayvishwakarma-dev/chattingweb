import api from './api';

export const chatService = {
  getAll: async () => {
    const response = await api.get('/chats');
    return response.data;
  },

  create: async (participantId) => {
    const response = await api.post('/chats', { participantId });
    return response.data;
  },

  getOrCreate: async (userId) => {
    const response = await api.post('/chats/get-or-create', { userId });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/chats/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/chats/${id}`);
    return response.data;
  },
};

export const messageService = {
  getMessages: async (chatId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/${chatId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  send: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },

  markAsRead: async (data) => {
    const response = await api.put('/messages/read', data);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/messages/unread/count');
    return response.data;
  },

  forward: async (id, data) => {
    const response = await api.post(`/messages/${id}/forward`, data);
    return response.data;
  },
};