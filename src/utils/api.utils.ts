// src/utils/api.utils.ts
/**
 * Creates a URL with query parameters
 */
export const createUrl = (baseUrl: string, params: Record<string, any>): string => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
        }
    });
    return url.toString();
};

/**
 * Handles API errors
 */
export const handleApiError = (error: any): string => {
    if (error.response) {
        // Server responded with error status
        return error.response.data?.message || 'An error occurred on the server';
    } else if (error.request) {
        // Request was made but no response
        return 'No response from server';
    } else {
        // Error setting up the request
        return error.message || 'An unexpected error occurred';
    }
};

/**
 * Retries a function with exponential backoff
 */
export const retry = async <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
): Promise<T> => {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }

    throw lastError;
};
