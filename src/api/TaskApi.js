import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5002/api',
});

// Attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProjects = () =>
    API.get('/projects/all');

export const fetchAllTasks = () =>
    API.get('/tasks');


export const fetchTasks = (projectId) =>
    API.get('/tasks/getTask', { params: { projectId } });




export const createProject = (projectData) =>
    API.post('/projects', projectData);

// TaskApi.js

export const deleteProject = (projectId) =>
  API.delete(`/projects/delete/${projectId}`);

// TaskApi.js

export const updateProject = (projectId, updatedProjectData) =>
  API.put(`/projects/update/${projectId}`, updatedProjectData);




export const createTask = (projectId, taskData) =>
    API.post(`/tasks`, { projectId, ...taskData });

export const assignUser = (taskId, userId) =>
  API.get(`/tasks/${taskId}/assign/user/${userId}`);

// TaskApi.js

export const deleteTask = (taskId) =>
  API.delete(`/tasks/delete/${taskId}`);

// TaskApi.js

export const updateTask = (taskId, updatedTaskData) =>
  API.put(`/tasks/update/${taskId}`, updatedTaskData);

export const fetchUserTasks = () =>
  API.get('/tasks/user/tasksAssigned');


export default API;
