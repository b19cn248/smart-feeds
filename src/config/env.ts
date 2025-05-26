// src/config/env.ts
export const env = {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://smart.feeds.api.openlearnhub.io.vn',
    // API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:88888',

    API_VERSION: process.env.REACT_APP_API_VERSION || 'v1',
};

export const getApiUrl = (path: string): string => {
    return `${env.API_BASE_URL}/api/${env.API_VERSION}${path}`;
};