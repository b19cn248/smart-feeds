// src/types/source.types.ts
import { Article } from './article.types';

export interface Source {
    id: number;
    url: string;
    language: string | null;
    type: string;
    account_id: string | null;
    hashtag: string | null;
    category: string | null;
    user_id: number;
    active: boolean;
    created_at: string;
}

export interface SourceResponse {
    status: number;
    message: string;
    data: {
        content: Source[];
        totalElements: number;
        totalPages: number;
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        numberOfElements: number;
        empty: boolean;
    };
    timestamp: string;
}

// Thêm interface cho api response lấy articles của source
export interface SourceArticlesResponse {
    status: number;
    message: string;
    data: {
        source: Source;
        articles: Article[];
    };
    timestamp: string;
}