// src/services/folderService.ts
import { FolderResponse, FolderDetailResponse, CreateFolderRequest } from '../types';
import { apiClient } from './apiClient';

export const folderService = {
    /**
     * Fetches all folders from API
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getFolders(page = 0, size = 10): Promise<FolderResponse> {
        return apiClient.get<FolderResponse>(`/folders?page=${page}&size=${size}`);
    },

    /**
     * Get folder details by ID including sources
     * @param id - Folder ID
     */
    async getFolderById(id: number): Promise<FolderDetailResponse> {
        return apiClient.get<FolderDetailResponse>(`/folders/${id}`);
    },

    /**
     * Create a new folder
     * @param data - Folder data
     */
    async createFolder(data: CreateFolderRequest): Promise<FolderDetailResponse> {
        return apiClient.post<FolderDetailResponse>('/folders', data);
    },

    /**
     * Add sources to a folder (multiple at once)
     * @param folderId - Folder ID
     * @param sourceIds - Array of Source IDs
     */
    async addSourceToFolder(folderId: number, sourceIds: number[]): Promise<FolderDetailResponse> {
        return apiClient.post<FolderDetailResponse>(`/folders/${folderId}/sources`, { source_ids: sourceIds });
    },

    /**
     * Update a folder
     * @param id - Folder ID
     * @param data - Folder data (name, theme)
     */
    async updateFolder(id: number, data: CreateFolderRequest): Promise<FolderDetailResponse> {
        return apiClient.put<FolderDetailResponse>(`/folders/${id}`, data);
    },

    /**
     * Remove a source from a folder
     * @param folderId - Folder ID
     * @param sourceId - Source ID
     */
    async removeSourceFromFolder(folderId: number, sourceId: number): Promise<FolderDetailResponse> {
        return apiClient.delete<FolderDetailResponse>(`/folders/${folderId}/sources/${sourceId}`);
    }
};