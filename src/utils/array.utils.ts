// src/utils/array.utils.ts
/**
 * Groups an array of items by a specified key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

/**
 * Sorts an array of objects by a specified key
 */
export const sortBy = <T>(array: T[], key: keyof T, ascending = true): T[] => {
    return [...array].sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (valueA < valueB) return ascending ? -1 : 1;
        if (valueA > valueB) return ascending ? 1 : -1;
        return 0;
    });
};

/**
 * Removes duplicates from an array
 */
export const unique = <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
};

/**
 * Chunks an array into smaller arrays of specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
    const chunked: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
};