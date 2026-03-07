import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
};

export const jobService = {
  getAll: () => api.get('/jobs'),
  create: (jobData: any) => api.post('/jobs', jobData),
  apply: (applicationData: any) => api.post('/jobs/apply', applicationData),
  getMyApplications: () => api.get('/applications/my'),
};

export const resumeService = {
  analyze: (formData: FormData) => api.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyResume: () => api.get('/resume/my'),
};

export const aiService = {
  chat: (message: string) => api.post('/chat', { message }),
  getChatHistory: () => api.get('/chat/history'),
  startInterview: (type: string) => api.post('/interview/start', { type }),
  submitAnswer: (question: string, answer: string) => api.post('/interview/answer', { question, answer }),
};
