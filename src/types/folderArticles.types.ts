// src/types/folderArticles.types.ts
import { Article } from './article.types';
import { Source } from './source.types';

export interface FolderArticle extends Article {
    content_encoded?: string;
    content_snippet?: string;
    content_encoded_snippet?: string;
    hashtag?: string[]; // Đảm bảo có field hashtag
}

// Phần còn lại giữ nguyên
export interface FolderWithArticles {
    id: number;
    name: string;
    theme: string;
    user_id: number | null;
    created_at: string;
    articles: FolderArticle[];
}

export interface FolderDetailWithArticles {
    id: number;
    name: string;
    theme: string;
    user_id: number | null;
    created_at: string;
    sources: Source[];
    articles: {
        content: FolderArticle[];
        total_elements: number;
        total_pages: number;
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        number_of_elements: number;
        empty: boolean;
    };
}

export interface FoldersWithArticlesResponse {
    status: number;
    message: string;
    data: {
        content: FolderWithArticles[];
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

export interface FolderDetailWithArticlesResponse {
    status: number;
    message: string;
    data: FolderDetailWithArticles;
    timestamp: string;
}