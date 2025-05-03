// src/components/common/ProtectedRoute/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingScreen } from '../LoadingScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  roles = []
                                                              }) => {
    const { isAuthenticated, hasRole, hasRealmRole } = useAuth();

    // Kiểm tra authentication
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Kiểm tra roles nếu có
    if (roles.length > 0) {
        const hasRequiredRole = roles.some(role =>
            hasRole(role) || hasRealmRole(role)
        );

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};
