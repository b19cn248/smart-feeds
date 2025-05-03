// src/utils/validation.utils.ts
/**
 * Validates if a string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates if a string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};

/**
 * Validates if a string meets minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
};

/**
 * Validates if a string meets maximum length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
};

/**
 * Validates if a string contains only alphanumeric characters
 */
export const isAlphanumeric = (value: string): boolean => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value);
};