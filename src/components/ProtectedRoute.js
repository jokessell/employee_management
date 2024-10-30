// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ roles = [] }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.token) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && !roles.some(role => auth.roles.includes(role))) {
        // Logged in but doesn't have required role
        return <Navigate to="/access-denied" replace />; // Redirect to Access Denied page
    }

    return <Outlet />;
};

export default ProtectedRoute;
