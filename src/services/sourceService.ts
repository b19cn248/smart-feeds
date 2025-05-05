// src/services/sourceService.ts
import { Source, SourceResponse } from '../types';

const API_BASE_URL = 'https://smart.feeds.api.openlearnhub.io.vn/api/v1';

export const sourceService = {
    /**
     * Fetches sources from API
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getSources(page = 0, size = 100): Promise<SourceResponse> {
        const response = await fetch(`${API_BASE_URL}/sources?page=${page}&size=${size}`);

        if (!response.ok) {
            throw new Error('Failed to fetch sources');
        }

        return response.json();
    },

    /**
     * Get single source by ID
     * @param id - Source ID
     */
    async getSourceById(id: number): Promise<Source> {
        const response = await fetch(`${API_BASE_URL}/sources/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch source');
        }

        return response.json();
    }
};