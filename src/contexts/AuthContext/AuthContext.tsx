// src/contexts/AuthContext/AuthContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from '../../config/keycloak';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useToast } from '../../contexts/ToastContext';

// Định nghĩa interface cho Auth Context
interface AuthContextValue {
    isAuthenticated: boolean;
    user: any;
    token: string | undefined;
    logout: () => void;
    login: () => void;
    hasRole: (role: string) => boolean;
    hasRealmRole: (role: string) => boolean;
}

// Tạo Auth Context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Hook để sử dụng Auth Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Component AuthProvider wrapper
const AuthProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { keycloak, initialized } = useKeycloak();
    const previousTokenRef = useRef<string | undefined>(keycloak.token);
    const { showToast } = useToast();
    const [lastSsoCheck, setLastSsoCheck] = useState<number>(Date.now());

    // Lưu trạng thái đăng nhập hiện tại vào sessionStorage để theo dõi
    useEffect(() => {
        if (initialized) {
            sessionStorage.setItem('kc-authenticated', keycloak.authenticated ? 'true' : 'false');
        }
    }, [keycloak.authenticated, initialized]);

    // Kiểm tra xác thực và đồng bộ giữa các tab/cửa sổ
    useEffect(() => {
        // Xử lý sự kiện storage để đồng bộ trạng thái đăng nhập
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'kc-logout' && e.newValue) {
                // Chỉ xử lý khi có sự kiện từ tab khác
                if (keycloak.authenticated) {
                    console.log('Detected logout event, logging out...');
                    // Hiển thị thông báo trước khi đăng xuất
                    showToast('info', 'Session ended', 'You have been logged out in another tab.');
                    // Đăng xuất không reload trang
                    setTimeout(() => {
                        keycloak.logout({ redirectUri: window.location.origin });
                    }, 1000);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Kiểm tra trạng thái SSO định kỳ
        const checkSsoStatus = async () => {
            // Chỉ kiểm tra nếu đã đăng nhập và đã qua 15 giây kể từ lần kiểm tra trước
            if (keycloak.authenticated && Date.now() - lastSsoCheck > 15000) {
                try {
                    // Sử dụng iframe để kiểm tra trạng thái SSO mà không làm fresh token
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/login-status-iframe.html`;
                    document.body.appendChild(iframe);

                    // Sau 2 giây, nếu vẫn đăng nhập thì cập nhật token
                    setTimeout(async () => {
                        document.body.removeChild(iframe);
                        try {
                            await keycloak.updateToken(10);
                        } catch (error) {
                            // Nếu không thể cập nhật token, có thể đã đăng xuất ở nơi khác
                            console.log('Silent SSO check failed, session may have ended');
                            if (keycloak.authenticated) {
                                showToast('info', 'Session ended', 'Your session has expired.');
                                keycloak.logout({ redirectUri: window.location.origin });
                            }
                        }
                        setLastSsoCheck(Date.now());
                    }, 2000);
                } catch (error) {
                    console.error('Error during SSO check:', error);
                }
            }
        };

        // Thực hiện kiểm tra trạng thái SSO mỗi 15 giây
        const ssoInterval = setInterval(checkSsoStatus, 15000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(ssoInterval);
        };
    }, [keycloak, showToast, lastSsoCheck]);

    // Theo dõi thay đổi token để cập nhật và đồng bộ
    useEffect(() => {
        if (keycloak.token !== previousTokenRef.current) {
            previousTokenRef.current = keycloak.token;

            // Lưu thời gian cập nhật token
            if (keycloak.token) {
                sessionStorage.setItem('kc-token-updated', Date.now().toString());
            } else if (previousTokenRef.current && !keycloak.token) {
                // Token đã bị xóa, có thể đã đăng xuất
                sessionStorage.removeItem('kc-token-updated');
            }
        }
    }, [keycloak.token]);

    // Xử lý khi token bị từ chối
    useEffect(() => {
        const handleUnauthorized = (event: MessageEvent) => {
            if (event.data === 'kc-unauthorized' && keycloak.authenticated) {
                showToast('error', 'Authentication Error', 'Your session has expired. Please log in again.');
                setTimeout(() => {
                    keycloak.logout({ redirectUri: window.location.origin });
                }, 1000);
            }
        };

        window.addEventListener('message', handleUnauthorized);
        return () => {
            window.removeEventListener('message', handleUnauthorized);
        };
    }, [keycloak, showToast]);

    // Hiển thị loading screen trong khi Keycloak đang khởi tạo
    if (!initialized) {
        return <LoadingScreen />;
    }

    // Tạo các helper functions
    const hasRole = (role: string): boolean => {
        return keycloak.hasResourceRole(role);
    };

    const hasRealmRole = (role: string): boolean => {
        return keycloak.hasRealmRole(role);
    };

    const login = () => {
        keycloak.login();
    };

    const logout = () => {
        // Lưu timestamp đăng xuất vào cả localStorage và sessionStorage
        const logoutTime = Date.now().toString();
        localStorage.setItem('kc-logout', logoutTime);
        sessionStorage.setItem('kc-logout', logoutTime);

        // Xóa các dữ liệu khác để tránh trạng thái không hợp lệ
        sessionStorage.removeItem('kc-token-updated');
        sessionStorage.removeItem('kc-authenticated');

        // Đăng xuất trên Keycloak
        keycloak.logout({
            redirectUri: window.location.origin
        });
    };

    const value: AuthContextValue = {
        isAuthenticated: keycloak.authenticated || false,
        user: keycloak.tokenParsed,
        token: keycloak.token,
        logout,
        login,
        hasRole,
        hasRealmRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthProvider component chính
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Event handlers cho Keycloak
    const eventLogger = (event: string, error?: any) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Keycloak event:', event, error);
        }

        // Xử lý các sự kiện Keycloak
        if (event === 'onAuthLogout') {
            // Đồng bộ đăng xuất chỉ khi thực sự đăng xuất
            localStorage.setItem('kc-logout', Date.now().toString());
            sessionStorage.setItem('kc-logout', Date.now().toString());
        }
        else if (event === 'onAuthError') {
            console.error('Auth error:', error);
            // Thông báo lỗi qua postMessage để mọi phần của ứng dụng có thể biết
            window.postMessage('kc-unauthorized', window.location.origin);
        }
        else if (event === 'onAuthRefreshError') {
            console.error('Auth refresh error:', error);
            // Thông báo lỗi qua postMessage
            window.postMessage('kc-unauthorized', window.location.origin);
        }
    };

    const tokenLogger = (tokens: any) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Keycloak tokens refreshed');
        }
    };

    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
                onLoad: 'login-required',
                checkLoginIframe: true,
                checkLoginIframeInterval: 5, // Kiểm tra mỗi 5 giây
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                pkceMethod: 'S256',
                enableLogging: process.env.NODE_ENV !== 'production'
            }}
            onEvent={eventLogger}
            onTokens={tokenLogger}
            LoadingComponent={<LoadingScreen />}
        >
            <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </ReactKeycloakProvider>
    );
};