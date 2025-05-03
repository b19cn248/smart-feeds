// src/contexts/AuthContext/AuthContext.tsx
import React, { createContext, useContext } from 'react';
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

    const value: AuthContextValue = {
        isAuthenticated: keycloak.authenticated || false,
        user: keycloak.tokenParsed,
        token: keycloak.token,
        logout: () => keycloak.logout(),
        login: () => keycloak.login(),
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
    };

    const tokenLogger = (tokens: any) => {
        console.log('Keycloak tokens refreshed');
    };

    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
                onLoad: 'login-required', // Tự động redirect đến trang login nếu chưa đăng nhập
                checkLoginIframe: false,
                pkceMethod: 'S256',
            }}
            onEvent={eventLogger}
            onTokens={tokenLogger}
        >
            <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </ReactKeycloakProvider>
    );
};
