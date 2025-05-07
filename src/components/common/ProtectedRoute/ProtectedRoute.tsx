// src/components/common/ProtectedRoute/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
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
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isCheckingToken, setIsCheckingToken] = useState(false);

    // Kiểm tra token expire
    useEffect(() => {
        const checkToken = async () => {
            if (!isAuthenticated) return;

            setIsCheckingToken(true);
            try {
                if (keycloak.isTokenExpired(30)) { // Kiểm tra nếu token sẽ hết hạn trong 30 giây
                    try {
                        const refreshed = await keycloak.updateToken(30);
                        if (refreshed) {
                            if (process.env.NODE_ENV !== 'production') {
                                console.log('Token refreshed successfully');
                            }
                        } else {
                            if (process.env.NODE_ENV !== 'production') {
                                console.log('Token still valid, no refresh needed');
                            }
                        }
                    } catch (error) {
                        console.error('Token refresh failed', error);
                        // Hiển thị thông báo trước khi chuyển hướng
                        showToast('error', 'Session Expired', 'Your session has expired. Please log in again.');

                        // Thêm một chút delay để người dùng có thể thấy thông báo
                        setTimeout(() => {
                            // Đặt biến đăng xuất để đồng bộ với các tab khác
                            localStorage.setItem('kc-logout', Date.now().toString());
                            sessionStorage.setItem('kc-logout', Date.now().toString());

                            // Chuyển hướng đến trang login
                            keycloak.login({
                                redirectUri: window.location.href
                            });
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error('Error checking token:', error);
            } finally {
                setIsCheckingToken(false);
            }
        };

        // Kiểm tra ban đầu với độ trễ ngắn để tránh nhiều kiểm tra cùng lúc
        const initialCheck = setTimeout(checkToken, 500);

        // Thiết lập interval để kiểm tra định kỳ
        const intervalId = setInterval(checkToken, 15000); // Giảm xuống mỗi 15 giây

        // Xử lý sự kiện khi window được focus lại
        const handleFocus = () => {
            checkToken();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            clearTimeout(initialCheck);
            clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
        };
    }, [navigate, isAuthenticated, showToast]);

    // Xử lý sự kiện từ các component khác
    useEffect(() => {
        const handleUnauthorized = (event: MessageEvent) => {
            if (event.data === 'kc-unauthorized' && isAuthenticated) {
                showToast('error', 'Authentication Error', 'Your session has expired or is invalid.');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        };

        window.addEventListener('message', handleUnauthorized);
        return () => {
            window.removeEventListener('message', handleUnauthorized);
        };
    }, [navigate, isAuthenticated, showToast]);

    // Hiển thị loading khi đang kiểm tra token
    if (isCheckingToken) {
        return <LoadingScreen />;
    }

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