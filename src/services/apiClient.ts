// src/services/apiClient.ts
import keycloak from '../config/keycloak';
import { getApiUrl } from '../config/env';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

export const apiClient = {
    /**
     * Thực hiện request tới API với token tự động
     */
    async request<T>(
        endpoint: string,
        options: RequestOptions = { requiresAuth: true }
    ): Promise<T> {
        const url = getApiUrl(endpoint);

        // Mặc định cần xác thực trừ khi được chỉ định khác
        const { requiresAuth = true, ...requestOptions } = options;

        // Headers mặc định
        const headers = new Headers(options.headers);
        headers.set('Content-Type', 'application/json');

        // Thêm token nếu cần xác thực và có token
        if (requiresAuth && keycloak.token) {
            headers.set('Authorization', `Bearer ${keycloak.token}`);
        }

        // Đảm bảo token còn hiệu lực nếu cần xác thực
        if (requiresAuth && keycloak.token) {
            try {
                // Tự động refresh nếu token sắp hết hạn (< 30 giây)
                const tokenRefreshed = await keycloak.updateToken(30);
                if (tokenRefreshed) {
                    console.log('Token was successfully refreshed');
                    // Cập nhật token mới vào header
                    headers.set('Authorization', `Bearer ${keycloak.token}`);
                }
            } catch (error) {
                console.error('Failed to refresh token', error);
                // Chuyển hướng về trang login nếu không refresh được
                keycloak.login();
                throw new Error('Authentication required');
            }
        }

        // Thực hiện request
        const response = await fetch(url, {
            ...requestOptions,
            headers
        });

        // Xử lý lỗi
        if (!response.ok) {
            // Xử lý trường hợp token không hợp lệ hoặc hết hạn
            if (response.status === 401 || response.status === 403) {
                // Refresh token và thử lại
                try {
                    const refreshed = await keycloak.updateToken(30);

                    if (refreshed) {
                        // Thử lại request với token mới
                        headers.set('Authorization', `Bearer ${keycloak.token}`);
                        const retryResponse = await fetch(url, {
                            ...requestOptions,
                            headers
                        });

                        if (retryResponse.ok) {
                            return retryResponse.json();
                        }
                    }

                    // Nếu vẫn không được, đăng xuất hoặc chuyển về trang login
                    keycloak.login();
                } catch (error) {
                    keycloak.login();
                }
            }

            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || `HTTP error ${response.status}`);
        }

        return response.json();
    },

    /**
     * GET request
     */
    get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    },

    /**
     * POST request
     */
    post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        });
    },

    /**
     * PUT request
     */
    put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        });
    },

    /**
     * DELETE request
     */
    delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
};