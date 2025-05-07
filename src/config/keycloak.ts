// src/config/keycloak.ts
import Keycloak from 'keycloak-js';

// Cấu hình Keycloak instance
const keycloakConfig = {
    url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080/auth',
    realm: process.env.REACT_APP_KEYCLOAK_REALM || 'your-realm',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'your-client-id',
};

// Thêm logic xử lý cookie SameSite để hỗ trợ SSO giữa các domain
document.cookie = "KEYCLOAK_SESSION=true; SameSite=None; Secure";

// Khởi tạo Keycloak instance với tùy chọn mở rộng
const keycloak = new (Keycloak as any)(keycloakConfig);

// Cấu hình các callback

// Xử lý khi token hết hạn
keycloak.onTokenExpired = () => {
    console.log('Token has expired, updating token silently...');

    // Lưu trạng thái trước khi cập nhật
    const wasAuthenticated = keycloak.authenticated;

    keycloak.updateToken(30)
        .then((refreshed: boolean) => {
            if (refreshed) {
                console.log('Token refreshed successfully');
                // Thông báo token đã được cập nhật
                sessionStorage.setItem('kc-token-updated', Date.now().toString());
            } else {
                console.log('Token not refreshed, still valid');
            }
        })
        .catch((error: any) => {
            console.error('Failed to refresh token:', error);

            // Nếu trước đó đã xác thực nhưng không thể refresh,
            // có thể đã có đăng xuất ở nơi khác
            if (wasAuthenticated) {
                console.log('Token refresh failed, session may have ended');

                // Thông báo lỗi xác thực
                window.postMessage('kc-unauthorized', window.location.origin);

                // Đăng xuất sau một chút delay
                setTimeout(() => {
                    keycloak.login();
                }, 500);
            }
        });
};

// Xử lý khi đăng xuất
keycloak.onAuthLogout = () => {
    console.log('User logged out');
    // Đồng bộ trạng thái đăng xuất
    localStorage.setItem('kc-logout', Date.now().toString());
    sessionStorage.setItem('kc-logout', Date.now().toString());

    // Xóa các dữ liệu session khác
    sessionStorage.removeItem('kc-token-updated');
    sessionStorage.removeItem('kc-authenticated');
};

// Xử lý lỗi xác thực
keycloak.onAuthError = (error: any) => {
    console.error('Authentication error:', error);
    // Thông báo lỗi xác thực
    window.postMessage('kc-unauthorized', window.location.origin);
};

// Tạo file silent-check-sso.html nếu chưa có
// File này cần được đặt ở thư mục public để hỗ trợ kiểm tra SSO
try {
    // Chỉ thực hiện trong môi trường development
    if (process.env.NODE_ENV === 'development') {
        const fs = require('fs');
        const path = require('path');
        const publicPath = path.resolve(process.cwd(), 'public');
        const ssoFilePath = path.join(publicPath, 'silent-check-sso.html');

        if (!fs.existsSync(ssoFilePath)) {
            const ssoContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Silent SSO Check</title>
                    <script>
                        parent.postMessage(location.href, location.origin);
                    </script>
                </head>
                <body>
                    Silent SSO Check
                </body>
                </html>
            `;

            fs.writeFileSync(ssoFilePath, ssoContent);
            console.log('Created silent-check-sso.html');
        }
    }
} catch (error) {
    console.warn('Could not create silent-check-sso.html:', error);
}

export default keycloak;