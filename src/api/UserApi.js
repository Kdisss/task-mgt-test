import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Fetch all users
export const fetchUsers = () => API.get('/users');

// Create a new user

// Update user details
export const updateUser = (userData) =>
  API.post('/users/update', userData);

// Delete a user by ID
export const deleteUser = (userId) =>
  API.delete(`/users/delete/${userId}`);

// Fetch user profile based on the token
export const fetchUserProfile = () => API.get('/users/profile');
