// src/services/categoryService.ts
import { apiClient } from './apiClient';
import { CategoriesResponse, CategoryArticlesResponse } from '../types/category.types';

export const categoryService = {
    /**
     * Lấy danh sách tất cả categories
     */
    getCategories: async (): Promise<CategoriesResponse> => {
        return apiClient.get<CategoriesResponse>(`/categories`);
    },

    /**
     * Lấy danh sách articles theo categoryId
     * @param categoryId ID của category
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getCategoryArticles: async (categoryId: number, page = 0, size = 20): Promise<CategoryArticlesResponse> => {
        return apiClient.get<CategoryArticlesResponse>(`/categories/${categoryId}/articles?page=${page}&size=${size}`);
    }
};