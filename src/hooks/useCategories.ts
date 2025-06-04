// src/hooks/useCategories.ts
import { useState, useEffect } from 'react';
import { Category } from '../types/category.types';
import { categoryService } from '../services/categoryService';

interface UseCategoriesReturn {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
}

/**
 * Custom hook để quản lý categories
 * Tự động fetch categories khi component mount
 */
export const useCategories = (): UseCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await categoryService.getCategories();
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch categories khi hook được sử dụng lần đầu
    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        isLoading,
        error,
        fetchCategories
    };
};