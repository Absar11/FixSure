import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
console.log('FixSure API connected to:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { API_BASE_URL };
