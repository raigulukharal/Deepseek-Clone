import api from './api';

export const aiAPI = {
  sendPrompt: (prompt) => api.post('/api/v1/deepseekai/prompt', { prompt }),
  getTodayPrompt: () => api.get('/api/v1/deepseekai/today-prompt'),
  clearPrompt: () => api.post('/api/v1/deepseekai/clearPrompt'),
};