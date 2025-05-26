// src/services/exploreService.ts
import { apiClient } from './apiClient';
import { Article } from '../types';

export interface ExploreCollection {
    id: number;
    name: string;
    description: string;
    image_url: string;
    type: string;
    priority: number;
    is_active: boolean;
    created_at: string;
    articles: Article[];
}

export interface ExploreCollectionsResponse {
    status: number;
    message: string;
    data: {
        content: ExploreCollection[];
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

export interface ExploreCategoryArticlesResponse {
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

export interface ExplorePageResponse {
    status: number;
    message: string;
    data: {
        collections: ExploreCollection[];
        top_stories: Article[];
        trending_topics: TrendingTopic[];
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

export const exploreService = {
    /**
     * Lấy explore collections
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getExploreCollections: async (page = 0, size = 20): Promise<ExploreCollectionsResponse> => {
        return apiClient.get<ExploreCollectionsResponse>(`/explore/collections?page=${page}&size=${size}`);
    },

    /**
     * Lấy bài viết từ collection cụ thể
     * @param collectionId ID của collection
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getCollectionArticles: async (collectionId: number, page = 0, size = 20): Promise<ExploreCategoryArticlesResponse> => {
        return apiClient.get<ExploreCategoryArticlesResponse>(`/explore/collections/${collectionId}/articles?page=${page}&size=${size}`);
    },

    /**
     * Lấy bài viết theo category
     * @param categoryId ID của category
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getCategoryArticles: async (categoryId: number, page = 0, size = 20): Promise<ExploreCategoryArticlesResponse> => {
        return apiClient.get<ExploreCategoryArticlesResponse>(`/explore/categories/${categoryId}/articles?page=${page}&size=${size}`);
    },

    /**
     * Lấy bài viết gần đây
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    getRecentArticles: async (page = 0, size = 20): Promise<ExploreCategoryArticlesResponse> => {
        return apiClient.get<ExploreCategoryArticlesResponse>(`/explore/recent?page=${page}&size=${size}`);
    },

    /**
     * Tìm kiếm bài viết
     * @param keyword Từ khóa tìm kiếm
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     */
    searchArticles: async (keyword: string, page = 0, size = 20): Promise<ExploreCategoryArticlesResponse> => {
        return apiClient.get<ExploreCategoryArticlesResponse>(`/explore/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    },

    /**
     * Lấy trang explore tổng hợp
     * @param collectionSize Số lượng collections
     * @param articlesPerCollection Số bài viết trên mỗi collection
     * @param topStoriesSize Số lượng top stories
     * @param trendingTopicsSize Số lượng trending topics
     */
    getExplorePage: async (
        collectionSize = 5,
        articlesPerCollection = 5,
        topStoriesSize = 10,
        trendingTopicsSize = 10
    ): Promise<ExplorePageResponse> => {
        return apiClient.get<ExplorePageResponse>(
            `/explore?collection_size=${collectionSize}&articles_per_collection=${articlesPerCollection}&top_stories_size=${topStoriesSize}&trending_topics_size=${trendingTopicsSize}`
        );
    }
};