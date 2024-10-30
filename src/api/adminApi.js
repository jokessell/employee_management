// src/api/adminApi.js
import axiosInstance from './axiosConfig';

// Get all roles
export const getAllRoles = () => {
    return axiosInstance.get('/admin/roles');
};

// Assign roles to a user
export const assignRole = (assignRoleData) => {
    return axiosInstance.post('/admin/assign-role', assignRoleData);
};

// Get all users
export const getAllUsers = () => {
    return axiosInstance.get('/admin/users');
};

export const deleteUser = (userId) => {
    return axiosInstance.delete(`/admin/users/${userId}`);
};