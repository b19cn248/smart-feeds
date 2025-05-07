// src/config/keycloak.ts
import Keycloak from 'keycloak-js';

// Cấu hình Keycloak instance
const keycloakConfig = {
    url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080/auth',
    realm: process.env.REACT_APP_KEYCLOAK_REALM || 'your-realm',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'your-client-id',
};

// Khởi tạo Keycloak instance
const keycloak = new (Keycloak as any)(keycloakConfig);

// Xử lý khi token hết hạn, chủ động làm mới token thay vì reload trang
keycloak.onTokenExpired = () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Token has expired, updating token silently...');
    }

    keycloak.updateToken(30)
        .then((refreshed: any) => {
            if (refreshed) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Token refreshed successfully');
                }
                // Không cần lưu trạng thái vào localStorage ở đây
                // Thay vào đó sẽ được xử lý ở AuthContext
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Token not refreshed, still valid');
                }
            }
        })
        .catch((error: any) => {
            console.error('Failed to refresh token:', error);
            // Chỉ login lại khi thực sự cần thiết
            if (keycloak.authenticated) {
                keycloak.login();
            }
        });
};

export default keycloak;