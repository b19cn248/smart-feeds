// src/types/article.types.ts
export interface Article {
    id: number; // Đổi từ string sang number theo API
    title: string;
    content: string;
    publish_date: string; // Đổi từ publishedAt: Date
    summary: string | null;
    event: string | null;
    source: string;
    url: string;
    author: string;
}

export interface ArticleResponse {
    status: number;
    message: string;
    data: {
        content: Article[];
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