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
    category_id?: number; // Thêm trường category_id
    user_id: number;
    active: boolean;
    created_at: string;
}

// Thêm interface cho request tạo source mới
export interface CreateSourceRequest {
    name: string;
    url: string;
    category_id: number;
}

// Thêm interface cho request cập nhật source
export interface UpdateSourceRequest {
    name: string;
    url: string;
    category_id: number;
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