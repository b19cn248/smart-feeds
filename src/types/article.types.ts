// src/types/article.types.ts
export interface Article {
    id: string;
    title: string;
    content: string;
    source: string;
    author: string;
    publishedAt: Date;
    url: string;
    imageUrl?: string;
}