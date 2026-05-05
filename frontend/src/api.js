import axios from 'axios';

// Axios instance configured for the CDRN backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cdrn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired or invalid, clear storage and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cdrn_token');
      localStorage.removeItem('cdrn_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
