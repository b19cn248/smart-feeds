// src/types/source.types.ts
import { Article } from './article.types';

export interface Source {
    id: number;
    url: string;
    name: string;
    image_url?: string;
    language: string | null;
    type: string;
    account_id: string | null;
    hashtag: string | null;
    category: string | null;
    category_id?: number; // Deprecated - giữ lại để backward compatibility
    categories_ids: number[]; // Mới - mảng category IDs
    user_id: number;
    active: boolean;
    created_at: string;
}

// Request tạo source mới - cập nhật để hỗ trợ nhiều categories
export interface CreateSourceRequest {
    name: string;
    url: string;
    category_ids: number[]; // Thay đổi từ category_id thành category_ids (mảng)
}

// Request cập nhật source - cập nhật để hỗ trợ nhiều categories
export interface UpdateSourceRequest {
    name: string;
    url: string;
    category_ids: number[]; // Thay đổi từ category_id thành category_ids (mảng)
    active: boolean;
    type: string;
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

// Response cho single source (với data có thể null)
export interface SingleSourceResponse {
    status: number;
    message: string;
    data: Source | null; // Cho phép data null như API trả về
    timestamp: string;
}

// Response cho operations (create, update, delete) - data có thể null
export interface SourceOperationResponse {
    status: number;
    message: string;
    data: Source | null; // Cho phép data null
    timestamp: string;
}

// API response lấy articles của source
export interface SourceArticlesResponse {
    status: number;
    message: string;
    data: {
        source: Source;
        articles: Article[];
    };
    timestamp: string;
}