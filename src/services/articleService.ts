// src/services/articleService.ts
import { Article, ArticleResponse } from '../types';
import { getApiUrl } from '../config/env';

export const articleService = {
    /**
     * Fetches articles from API
     * @param page - Page number (optional)
     * @param size - Page size (optional)
     */
    async getArticles(page = 0, size = 1000): Promise<ArticleResponse> {
        const response = await fetch(getApiUrl(`/articles?page=${page}&size=${size}`));

        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }

        return response.json();
    },

    /**
     * Get single article by ID
     * @param id - Article ID
     */
    async getArticleById(id: number): Promise<Article> {
        // Since API doesn't provide single article endpoint, we'll fetch all and filter
        const response = await this.getArticles();
        const article = response.data.content.find(a => a.id === id);

        if (!article) {
            throw new Error('Article not found');
        }

        return article;
    }
};