// src/utils/color.utils.ts
/**
 * Converts hex color to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Converts RGB to hex color
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

/**
 * Gets contrast color (black or white) based on background color
 */
export const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Lightens a color by a percentage
 */
export const lightenColor = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = percent / 100;
    const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
    const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
    const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));

    return rgbToHex(r, g, b);
};

/**
 * Darkens a color by a percentage
 */
export const darkenColor = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = percent / 100;
    const r = Math.max(0, Math.round(rgb.r * (1 - factor)));
    const g = Math.max(0, Math.round(rgb.g * (1 - factor)));
    const b = Math.max(0, Math.round(rgb.b * (1 - factor)));

    return rgbToHex(r, g, b);
};