// src/types/category.types.ts
import { Article } from './article.types';

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface CategoriesResponse {
    status: number;
    message: string;
    data: Category[];
    timestamp: string;
}

export interface CategoryArticlesResponse {
    status: number;
    message: string;
    data: {
        content: Article[];
        totalElements?: number;
        total_elements?: number;
        totalPages?: number;
        total_pages?: number;
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        numberOfElements?: number;
        number_of_elements?: number;
        empty: boolean;
    };
    timestamp: string;
}