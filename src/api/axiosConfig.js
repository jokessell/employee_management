// src/api/axiosConfig.js

import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8888/api', // Adjust as needed
});

// Setup request interceptor to attach the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Setup response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Unauthorized: Possibly token expired or invalid
                // Trigger logout
                // Since we cannot use hooks here, consider using a global event emitter or other state management
                window.location.href = '/login';
                alert('Session expired. Please log in again.');
            } else if (error.response.status === 403) {
                // Forbidden
                alert('You do not have permission to perform this action.');
            } else if (error.response.status === 404 && error.response.data?.message?.includes('User not found')) {
                // Specific handling for UsernameNotFoundException
                window.location.href = '/login';
                alert('User not found. Please log in.');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
