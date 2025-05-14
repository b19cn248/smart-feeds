// src/types/board.types.ts
import { Article } from './article.types';

export interface Board {
    id: number;
    name: string;
    description: string | null;
    color: string;
    icon: string;
    is_public: boolean;
    created_at: string;
    articles?: Article[];
}

export interface BoardCreateRequest {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    is_public?: boolean;
}

export interface BoardUpdateRequest {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    is_public?: boolean;
}

export interface BoardResponse {
    status: number;
    message: string;
    data: Board;
    timestamp: string;
}

export interface BoardsResponse {
    status: number;
    message: string;
    data: {
        content: Board[];
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

export interface AddArticleRequest {
    article_id: number;
    note?: string;
}

export interface AddArticleFromUrlRequest {
    url: string;
    title?: string;
    content?: string;
    note?: string;
}