// src/contexts/AuthContext/AuthContext.tsx
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from '../../config/keycloak';
import { LoadingScreen } from '../../components/common/LoadingScreen';

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

    // Kiểm tra xác thực và đồng bộ giữa các tab/cửa sổ
    useEffect(() => {
        // Xử lý sự kiện storage để đồng bộ đăng xuất
        const handleStorageChange = (e: StorageEvent) => {
            // Chỉ xử lý khi có sự kiện từ tab khác, không phải tab hiện tại
            if (e.key === 'kc-logout') {
                // Chỉ làm mới trang nếu phát hiện đăng xuất từ tab khác
                const currentValue = localStorage.getItem('kc-logout');
                if (currentValue && e.newValue !== e.oldValue) {
                    // Kiểm tra nếu đang được đăng nhập, thì mới cần logout
                    if (keycloak.authenticated) {
                        console.log('Detected logout from another tab, logging out...');
                        // Đăng xuất không reload trang
                        keycloak.logout({ redirectUri: window.location.origin });
                    }
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [keycloak]);

    // Theo dõi thay đổi token để cập nhật và đồng bộ
    useEffect(() => {
        // Chỉ lưu token mới nếu thực sự có sự thay đổi
        if (keycloak.token !== previousTokenRef.current) {
            previousTokenRef.current = keycloak.token;

            // Không cần lưu toàn bộ token vào localStorage vì lý do bảo mật
            // Chỉ cần lưu thời gian cập nhật để thông báo cho các tab khác
            if (keycloak.token) {
                const tokenUpdateTime = Date.now().toString();
                // Lưu vào sessionStorage để chỉ ảnh hưởng đến tab hiện tại
                sessionStorage.setItem('kc-token-updated', tokenUpdateTime);
            }
        }
    }, [keycloak.token]);

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
        // Thêm một signal để các tab khác biết đã đăng xuất
        // Sử dụng timestamp hiện tại để đảm bảo giá trị mới khác với giá trị cũ
        localStorage.setItem('kc-logout', Date.now().toString());
        keycloak.logout();
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
        console.log('Keycloak event:', event, error);

        // Thêm xử lý các sự kiện để cải thiện SSO
        if (event === 'onAuthLogout') {
            // Đồng bộ đăng xuất chỉ khi thực sự đăng xuất
            localStorage.setItem('kc-logout', Date.now().toString());
        }

        // Không cần ghi log mọi sự kiện, tránh quá nhiều console output
        if (event === 'onAuthRefreshError') {
            console.error('Auth refresh error:', error);
        }
    };

    const tokenLogger = (tokens: any) => {
        // Không cần log ra console, giảm thiểu output
        if (process.env.NODE_ENV !== 'production') {
            console.log('Keycloak tokens refreshed');
        }
    };

    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
                onLoad: 'login-required', // Tự động redirect đến trang login nếu chưa đăng nhập
                checkLoginIframe: true, // Quan trọng cho SSO, kiểm tra trạng thái đăng nhập
                checkLoginIframeInterval: 10, // Kiểm tra mỗi 10 giây, tăng lên để giảm tải
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                pkceMethod: 'S256',
            }}
            onEvent={eventLogger}
            onTokens={tokenLogger}
            LoadingComponent={<LoadingScreen />}
        >
            <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </ReactKeycloakProvider>
    );
};