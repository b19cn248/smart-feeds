// src/services/sourceService.ts
import { Source, SourceResponse, SourceArticlesResponse } from '../types';
import { apiClient } from './apiClient';

export const sourceService = {
    /**
     * Fetches sources from API
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getSources(page = 0, size = 100): Promise<SourceResponse> {
        return apiClient.get<SourceResponse>(`/sources?page=${page}&size=${size}`);
    },

    /**
     * Get single source by ID
     * @param id - Source ID
     */
    async getSourceById(id: number): Promise<Source> {
        return apiClient.get<Source>(`/sources/${id}`);
    },

    /**
     * Get articles from a specific source
     * @param id - Source ID
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getSourceArticles(id: number, page = 0, size = 100): Promise<SourceArticlesResponse> {
        // Lưu ý: Hiện tại API không hỗ trợ phân trang nên không truyền tham số này
        return apiClient.get<SourceArticlesResponse>(`/sources/${id}/articles?page=${page}&size=${size}`);
    }
};