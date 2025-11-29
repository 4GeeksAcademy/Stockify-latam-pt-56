import React from 'react';
import { Navigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { store } = useGlobalReducer();
    const token = store.token;
    const userData = store.userData;

    // Si no hay token, redirigir al login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole && userData?.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;