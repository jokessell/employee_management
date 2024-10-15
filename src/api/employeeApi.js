// src/api/employeeApi.js
import axiosInstance from './axiosConfig';

// Get all employees with optional pagination and sorting
export const getAllEmployees = (params = {}) => {
    return axiosInstance.get('/employees', { params });
};

// Get employee by ID
export const getEmployeeById = (id) => {
    return axiosInstance.get(`/employees/${id}`);
};

// Create a new employee with skills and projects
export const createEmployee = (employeeData) => {
    return axiosInstance.post('/employees', employeeData);
};

// Update an existing employee with skills and projects
export const updateEmployee = (id, employeeData) => {
    return axiosInstance.put(`/employees/${id}`, employeeData);
};

// Delete an employee
export const deleteEmployee = (id) => {
    return axiosInstance.delete(`/employees/${id}`);
};
