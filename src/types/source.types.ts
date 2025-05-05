// src/types/source.types.ts
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