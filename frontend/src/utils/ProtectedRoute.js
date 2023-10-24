import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.user);
    const location = useLocation();

    if(!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;