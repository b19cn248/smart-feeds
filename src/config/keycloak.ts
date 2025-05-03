// src/config/keycloak.ts
import Keycloak from 'keycloak-js';

// Cấu hình Keycloak instance
// Thay đổi các giá trị này theo cấu hình Keycloak server của bạn
const keycloakConfig = {
    url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080/auth',
    realm: process.env.REACT_APP_KEYCLOAK_REALM || 'your-realm',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'your-client-id',
};

// Khởi tạo Keycloak instance
const keycloak = new (Keycloak as any)(keycloakConfig);

export default keycloak;