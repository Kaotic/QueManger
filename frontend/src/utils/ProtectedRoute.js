import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isAuthenticated) {
            navigate('/login');
        }
    }, [user, navigate]);

    return user.isAuthenticated ? <Outlet /> : null;
}

export default ProtectedRoute;