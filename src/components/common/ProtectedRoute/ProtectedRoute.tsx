// src/components/common/ProtectedRoute/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingScreen } from '../LoadingScreen';
import keycloak from '../../../config/keycloak';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  roles = []
                                                              }) => {
    const { isAuthenticated, hasRole, hasRealmRole } = useAuth();
    const navigate = useNavigate();

    // Kiểm tra token expire
    useEffect(() => {
        const checkToken = async () => {
            if (keycloak.isTokenExpired()) {
                try {
                    const refreshed = await keycloak.updateToken(30);
                    if (!refreshed) {
                        // Token không cần refresh
                        console.log('Token still valid');
                    }
                } catch (error) {
                    console.error('Token refresh failed', error);
                    // Chuyển hướng đến trang login
                    keycloak.login();
                }
            }
        };

        // Kiểm tra ban đầu
        checkToken();

        // Thiết lập interval để kiểm tra định kỳ
        const intervalId = setInterval(checkToken, 60000); // Mỗi phút

        return () => {
            clearInterval(intervalId);
        };
    }, [navigate]);

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