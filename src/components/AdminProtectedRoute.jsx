import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAdminAuth();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
