import api from './api';

export const authAPI = {
  login: (credentials) => api.post('/api/v1/user/login', credentials),
  signup: (userData) => api.post('/api/v1/user/signup', userData),
  logout: () => api.get('/api/v1/user/logout'),
};