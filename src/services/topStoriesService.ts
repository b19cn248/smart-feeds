// src/services/topStoriesService.ts
import { apiClient } from './apiClient';
import { Article } from '../types';

export interface TopStoriesResponse {
    status: number;
    message: string;
    data: {
        content: Article[];
        total_elements: number;
        total_pages: number;
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        number_of_elements: number;
        empty: boolean;
    };
    timestamp: string;
}

export interface TrendingTopicsResponse {
    status: number;
    message: string;
    data: {
        content: TrendingTopic[];
        total_elements: number;
        total_pages: number;
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        number_of_elements: number;
        empty: boolean;
    };
    timestamp: string;
}

export interface TrendingTopic {
    id: number;
    topic_name: string;
    category_id: number;
    category_name: string;
    score: number;
    start_date: string;
    end_date: string;
}

export const topStoriesService = {
    /**
     * Lấy top stories
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getTopStories: async (page = 0, size = 20): Promise<TopStoriesResponse> => {
        return apiClient.get<TopStoriesResponse>(`/top-stories?page=${page}&size=${size}`);
    },

    /**
     * Lấy trending articles
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getTrendingArticles: async (page = 0, size = 20): Promise<TopStoriesResponse> => {
        return apiClient.get<TopStoriesResponse>(`/top-stories/trending?page=${page}&size=${size}`);
    },

    /**
     * Lấy trending articles theo category
     * @param categoryId ID của category
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getTrendingArticlesByCategory: async (categoryId: number, page = 0, size = 20): Promise<TopStoriesResponse> => {
        return apiClient.get<TopStoriesResponse>(`/top-stories/trending/categories/${categoryId}?page=${page}&size=${size}`);
    },

    /**
     * Lấy trending articles theo tag
     * @param tagName Tên của tag
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getTrendingArticlesByTag: async (tagName: string, page = 0, size = 20): Promise<TopStoriesResponse> => {
        return apiClient.get<TopStoriesResponse>(`/top-stories/trending/tags/${tagName}?page=${page}&size=${size}`);
    },

    /**
     * Lấy trending topics
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getTrendingTopics: async (page = 0, size = 20): Promise<TrendingTopicsResponse> => {
        return apiClient.get<TrendingTopicsResponse>(`/top-stories/trending-topics?page=${page}&size=${size}`);
    },

    /**
     * Theo dõi lượt xem bài viết
     * @param articleId ID của bài viết
     */
    trackArticleView: async (articleId: number): Promise<void> => {
        return apiClient.post<void>(`/top-stories/track/view/${articleId}`, null);
    }
};