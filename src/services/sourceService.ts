// src/services/sourceService.ts
import {
    Source,
    SourceResponse,
    SourceArticlesResponse,
    SingleSourceResponse,
    SourceOperationResponse,
    CreateSourceRequest,
    UpdateSourceRequest
} from '../types';
import { apiClient } from './apiClient';

export const sourceService = {
    /**
     * Fetches sources from API
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getSources(page = 0, size = 100): Promise<SourceResponse> {
        try {
            console.log(`📡 Fetching sources: page=${page}, size=${size}`);
            const response = await apiClient.get<SourceResponse>(`/sources?page=${page}&size=${size}`);

            // Validate response structure
            if (!response || typeof response !== 'object') {
                throw new Error('Invalid response format from sources API');
            }

            if (!response.data || !response.data.content || !Array.isArray(response.data.content)) {
                throw new Error('Sources API returned invalid data structure');
            }

            console.log(`✅ Fetched ${response.data.content.length} sources successfully`);
            return response;
        } catch (error) {
            console.error('❌ Error in getSources:', error);
            throw error;
        }
    },

    /**
     * Get single source by ID
     * @param id - Source ID
     */
    async getSourceById(id: number): Promise<SingleSourceResponse> {
        try {
            if (!id || typeof id !== 'number') {
                throw new Error('Invalid source ID provided');
            }

            console.log(`📡 Fetching source by ID: ${id}`);
            const response = await apiClient.get<SingleSourceResponse>(`/sources/${id}`);

            // Validate response - chấp nhận data có thể null
            if (!response || typeof response.status !== 'number') {
                throw new Error('Source API returned invalid response');
            }

            // Nếu có data, validate nó
            if (response.data && typeof response.data.id !== 'number') {
                throw new Error('Source API returned invalid source data');
            }

            console.log(`✅ Fetched source ${id} successfully`);
            return response;
        } catch (error) {
            console.error(`❌ Error fetching source ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create new source
     * @param data - Source data (name, url, category_id)
     */
    async createSource(data: CreateSourceRequest): Promise<SourceOperationResponse> {
        try {
            // Validate input data
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid source data provided');
            }

            if (!data.name || !data.name.trim()) {
                throw new Error('Source name is required');
            }

            if (!data.url || !data.url.trim()) {
                throw new Error('Source URL is required');
            }

            if (!data.category_id || typeof data.category_id !== 'number') {
                throw new Error('Valid category ID is required');
            }

            // Validate URL format
            try {
                new URL(data.url);
            } catch {
                throw new Error('Invalid URL format');
            }

            console.log('📡 Creating new source:', data);

            const response = await apiClient.post<SourceOperationResponse>('/sources', {
                name: data.name.trim(),
                url: data.url.trim(),
                category_id: data.category_id
            });

            // Validate response - chấp nhận data: null
            if (!response || typeof response.status !== 'number') {
                throw new Error('Create source API returned invalid response');
            }

            // Check status code thay vì validate data
            if (response.status === 201 || (response.status >= 200 && response.status < 300)) {
                console.log('✅ Source created successfully with status:', response.status);
                return response;
            } else {
                throw new Error(`Create source failed with status: ${response.status} - ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('❌ Error creating source:', error);

            // Enhance error message for better UX
            if (error instanceof Error) {
                if (error.message.includes('400')) {
                    throw new Error('Invalid source data. Please check your input and try again.');
                } else if (error.message.includes('409')) {
                    throw new Error('A source with this URL already exists.');
                } else if (error.message.includes('500')) {
                    throw new Error('Server error. Please try again later.');
                }
            }

            throw error;
        }
    },

    /**
     * Update existing source
     * @param id - Source ID
     * @param data - Updated source data
     */
    async updateSource(id: number, data: UpdateSourceRequest): Promise<SourceOperationResponse> {
        try {
            // Validate input
            if (!id || typeof id !== 'number') {
                throw new Error('Invalid source ID provided');
            }

            if (!data || typeof data !== 'object') {
                throw new Error('Invalid update data provided');
            }

            // Validate required fields
            if (!data.name || !data.name.trim()) {
                throw new Error('Source name is required');
            }

            if (!data.url || !data.url.trim()) {
                throw new Error('Source URL is required');
            }

            if (!data.category_id || typeof data.category_id !== 'number') {
                throw new Error('Valid category ID is required');
            }

            // Validate URL format
            try {
                new URL(data.url);
            } catch {
                throw new Error('Invalid URL format');
            }

            console.log(`📡 Updating source ${id}:`, data);

            const updatePayload = {
                name: data.name.trim(),
                url: data.url.trim(),
                category_id: data.category_id,
                type: data.type || 'RSS',
                active: data.active ?? true
            };

            const response = await apiClient.put<SourceOperationResponse>(`/sources/${id}`, updatePayload);

            // Validate response - chấp nhận data: null
            if (!response || typeof response.status !== 'number') {
                throw new Error('Update source API returned invalid response');
            }

            // Check status code
            if (response.status >= 200 && response.status < 300) {
                console.log(`✅ Source ${id} updated successfully with status:`, response.status);
                return response;
            } else {
                throw new Error(`Update source failed with status: ${response.status} - ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`❌ Error updating source ${id}:`, error);

            // Enhance error message for better UX
            if (error instanceof Error) {
                if (error.message.includes('404')) {
                    throw new Error('Source not found. It may have been deleted.');
                } else if (error.message.includes('400')) {
                    throw new Error('Invalid source data. Please check your input and try again.');
                } else if (error.message.includes('409')) {
                    throw new Error('A source with this URL already exists.');
                }
            }

            throw error;
        }
    },

    /**
     * Delete source
     * @param id - Source ID
     */
    async deleteSource(id: number): Promise<SourceOperationResponse> {
        try {
            if (!id || typeof id !== 'number') {
                throw new Error('Invalid source ID provided');
            }

            console.log(`📡 Deleting source ${id}`);

            const response = await apiClient.delete<SourceOperationResponse>(`/sources/${id}`);

            // Validate response - chấp nhận data: null
            if (!response || typeof response.status !== 'number') {
                throw new Error('Delete source API returned invalid response');
            }

            // Check status code
            if (response.status >= 200 && response.status < 300) {
                console.log(`✅ Source ${id} deleted successfully with status:`, response.status);
                return response;
            } else {
                throw new Error(`Delete source failed with status: ${response.status} - ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`❌ Error deleting source ${id}:`, error);

            // Enhance error message for better UX
            if (error instanceof Error) {
                if (error.message.includes('404')) {
                    throw new Error('Source not found. It may have already been deleted.');
                } else if (error.message.includes('403')) {
                    throw new Error('You do not have permission to delete this source.');
                }
            }

            throw error;
        }
    },

    /**
     * Get articles from a specific source
     * @param id - Source ID
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getSourceArticles(id: number, page = 0, size = 100): Promise<SourceArticlesResponse> {
        try {
            if (!id || typeof id !== 'number') {
                throw new Error('Invalid source ID provided');
            }

            console.log(`📡 Fetching articles for source ${id}: page=${page}, size=${size}`);

            const response = await apiClient.get<SourceArticlesResponse>(
                `/sources/${id}/articles?page=${page}&size=${size}`
            );

            // Validate response structure
            if (!response || !response.data || !response.data.source || !Array.isArray(response.data.articles)) {
                throw new Error('Source articles API returned invalid data structure');
            }

            console.log(`✅ Fetched ${response.data.articles.length} articles for source ${id}`);
            return response;
        } catch (error) {
            console.error(`❌ Error fetching articles for source ${id}:`, error);
            throw error;
        }
    }
};