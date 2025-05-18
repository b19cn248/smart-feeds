// src/types/article.types.ts
import { Source } from './source.types';

// src/types/article.types.ts
export interface Article {
    id: number;
    title: string;
    content: string;
    content_encoded?: string;
    publish_date: string;
    summary: string | null;
    event: string | null;
    source: string;
    url: string;
    author: string;
    image_url: string;
    content_snippet?: string;
    content_encoded_snippet?: string;
    hashtag?: string[]; // Thêm field hashtag
}

// Thêm interface mới cho nhóm bài viết theo nguồn
export interface ArticleGroup {
    source: Source;
    articles: Article[];
}

export interface ArticleResponse {
    status: number;
    message: string;
    data: {
        content: ArticleGroup[];
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