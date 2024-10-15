// src/api/skillApi.js
import axiosInstance from './axiosConfig';

// Get all skills with pagination
export const getAllSkills = (params = {}) => {
    return axiosInstance.get('/skills', { params });
};

// Get skill by ID
export const getSkillById = (id) => {
    return axiosInstance.get(`/skills/${id}`);
};

// Create a new skill
export const createSkill = (skillData) => {
    return axiosInstance.post('/skills', skillData);
};

// Update an existing skill
export const updateSkill = (id, skillData) => {
    return axiosInstance.put(`/skills/${id}`, skillData);
};

// Delete a skill
export const deleteSkill = (id) => {
    return axiosInstance.delete(`/skills/${id}`);
};
