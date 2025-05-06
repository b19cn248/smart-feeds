// src/services/folderService.ts
import { FolderResponse, FolderDetailResponse, CreateFolderRequest, FolderWithSources } from '../types';
import { getApiUrl } from '../config/env';

export const folderService = {
    /**
     * Fetches all folders from API
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getFolders(page = 0, size = 10): Promise<FolderResponse> {
        const response = await fetch(getApiUrl(`/folders?page=${page}&size=${size}`));

        if (!response.ok) {
            throw new Error('Failed to fetch folders');
        }

        return response.json();
    },

    /**
     * Get folder details by ID including sources
     * @param id - Folder ID
     */
    async getFolderById(id: number): Promise<FolderDetailResponse> {
        const response = await fetch(getApiUrl(`/folders/${id}`));

        if (!response.ok) {
            throw new Error('Failed to fetch folder details');
        }

        return response.json();
    },

    /**
     * Create a new folder
     * @param data - Folder data
     */
    async createFolder(data: CreateFolderRequest): Promise<FolderDetailResponse> {
        const response = await fetch(getApiUrl('/folders'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create folder');
        }

        return response.json();
    },

    /**
     * Add a source to a folder
     * @param folderId - Folder ID
     * @param sourceId - Source ID
     */
    async addSourceToFolder(folderId: number, sourceId: number): Promise<FolderDetailResponse> {
        const response = await fetch(getApiUrl(`/folders/${folderId}/sources`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ source_id: sourceId }),
        });

        if (!response.ok) {
            throw new Error('Failed to add source to folder');
        }

        return response.json();
    }
};