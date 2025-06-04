import axios from 'axios';
import { getApiUrl } from '../config/env';
import keycloak from '../config/keycloak';

const api = axios.create({
    baseURL: getApiUrl(''),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include token
api.interceptors.request.use(
    async (config) => {
        if (keycloak.token) {
            // Ensure token is fresh
            try {
                await keycloak.updateToken(70);
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle CORS errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export { api }; 