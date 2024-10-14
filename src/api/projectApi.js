// src/api/projectApi.js
import axiosInstance from './axiosConfig';

// Get all projects with pagination
export const getAllProjects = (page = 0, size = 10, sort = 'projectName,asc') => {
    return axiosInstance.get('/projects', {
        params: {
            page,
            size,
            sort,
        },
    });
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
