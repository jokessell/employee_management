// src/api/projectApi.js

import axiosInstance from './axiosConfig';

export const getAllProjects = async (params) => {
    return await axiosInstance.get('/projects', { params });
};

export const getProjectById = async (id) => {
    return await axiosInstance.get(`/projects/${id}`);
};

export const createProject = async (projectData) => {
    return await axiosInstance.post('/projects', projectData);
};

export const updateProject = async (id, projectData) => {
    return await axiosInstance.put(`/projects/${id}`, projectData);
};

export const partialUpdateProject = async (id, projectData) => {
    return await axiosInstance.patch(`/projects/${id}`, projectData);
};

export const deleteProject = async (id) => {
    return await axiosInstance.delete(`/projects/${id}`);
};

export const getProjectsByEmployeeId = async (employeeId) => {
    return await axiosInstance.get(`/projects/employee/${employeeId}`);
};
