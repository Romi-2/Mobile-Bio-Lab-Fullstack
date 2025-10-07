// api.ts
import axios, { AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Convert existing headers to AxiosHeaders or create new ones
      const headers = config.headers ? new AxiosHeaders(config.headers) : new AxiosHeaders();
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;