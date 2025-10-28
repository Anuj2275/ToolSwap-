import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = () => {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return <Loader/>; 
    }

    if (!token) {
        console.log("ProtectedRoute: No token found, redirecting to login."); 
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;