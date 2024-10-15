// src/api/projectApi.js
import axiosInstance from './axiosConfig';

// Get all projects with pagination
export const getAllProjects = (params = {}) => {
    return axiosInstance.get('/projects', { params });
};

// Create a new project
export const createProject = (projectData) => {
    return axiosInstance.post('/projects', projectData);
};

// Update an existing project
export const updateProject = (id, projectData) => {
    return axiosInstance.put(`/projects/${id}`, projectData);
};

// Delete a project
export const deleteProject = (id) => {
    return axiosInstance.delete(`/projects/${id}`);
};
