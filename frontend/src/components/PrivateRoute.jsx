import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
    const { user, token } = useAuth();

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }  

    return children
};
