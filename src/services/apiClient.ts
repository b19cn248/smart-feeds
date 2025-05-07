// src/services/apiClient.ts
import keycloak from '../config/keycloak';
import { getApiUrl } from '../config/env';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
    maxRetries?: number;
}

export const apiClient = {
    /**
     * Thực hiện request tới API với token tự động và xử lý retry
     */
    async request<T>(
        endpoint: string,
        options: RequestOptions = { requiresAuth: true, maxRetries: 1 }
    ): Promise<T> {
        const url = getApiUrl(endpoint);

        // Mặc định cần xác thực trừ khi được chỉ định khác
        const { requiresAuth = true, maxRetries = 1, ...requestOptions } = options;
        let retryCount = 0;

        // Hàm thực hiện request với retry
        const executeRequest = async (): Promise<T> => {
            // Headers mặc định
            const headers = new Headers(options.headers);
            headers.set('Content-Type', 'application/json');

            // Thêm token nếu cần xác thực và có token
            if (requiresAuth && keycloak.token) {
                headers.set('Authorization', `Bearer ${keycloak.token}`);
            }

            // Đảm bảo token còn hiệu lực nếu cần xác thực
            if (requiresAuth && keycloak.authenticated) {
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
                    // Thông báo lỗi xác thực
                    window.postMessage('kc-unauthorized', window.location.origin);
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
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(`Authorization error. Retry attempt ${retryCount}/${maxRetries}`);

                        try {
                            const refreshed = await keycloak.updateToken(10);
                            if (refreshed) {
                                console.log('Token refreshed before retry');
                                // Retry với token mới
                                return executeRequest();
                            }
                        } catch (refreshError) {
                            console.error('Token refresh failed before retry', refreshError);
                            // Thông báo lỗi xác thực
                            window.postMessage('kc-unauthorized', window.location.origin);
                            throw new Error('Authentication failed');
                        }
                    } else {
                        // Đã hết số lần retry, thông báo lỗi xác thực
                        window.postMessage('kc-unauthorized', window.location.origin);
                        throw new Error('Authentication failed after retries');
                    }
                }

                let errorMessage = 'An error occurred';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || `HTTP error ${response.status}`;
                } catch (e) {
                    errorMessage = `HTTP error ${response.status}`;
                }

                throw new Error(errorMessage);
            }

            return response.json();
        };

        return executeRequest();
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