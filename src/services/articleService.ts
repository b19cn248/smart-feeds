// src/services/articleService.ts
import { Article, ArticleResponse, Folder, FolderWithArticlesResponse, FolderDetailResponse } from '../types';
import { apiClient } from './apiClient';

export const articleService = {
    /**
     * Fetches folders with articles
     * @param page - Page number (optional)
     * @param size - Folders per page (optional)
     * @param article_size - Number of articles per folder (optional)
     */
    getFoldersWithArticles(page = 0, size = 20, article_size = 5): Promise<FolderWithArticlesResponse> {
        return apiClient.get<FolderWithArticlesResponse>(
            `/folders/with-articles?page=${page}&size=${size}&article_size=${article_size}`
        );
    },

    /**
     * Fetches articles from a specific folder with pagination
     * @param folderId - Folder ID
     * @param page - Page number (optional)
     * @param size - Articles per page (optional)
     */
    getFolderArticles(folderId: number, page = 0, size = 20): Promise<FolderDetailResponse> {
        return apiClient.get<FolderDetailResponse>(
            `/folders/${folderId}/articles?page=${page}&size=${size}`
        );
    },

    /**
     * Get single article by ID
     * @param id - Article ID
     */
    getArticleById(id: number): Promise<Article> {
        // Since API doesn't provide single article endpoint, we'll throw an error
        throw new Error('Direct article fetch not supported. Use folder articles instead.');
    }
};