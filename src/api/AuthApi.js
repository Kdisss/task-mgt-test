import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/auth',
});

// Attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const signupUser = (userData) =>
  API.post('/signup', userData);

export const updateUser = (userData) =>
  API.post('/update', userData);