// src/types/folder.types.ts
import { Source } from './source.types';

// Frontend folder representation
export interface Folder {
    id: number;
    name: string;
    theme: string;
    sourcesCount: number;
    lastUpdated: Date;
    color: string;
    isActive?: boolean;
}

// API folder representation
export interface ApiFolder {
    id: number;
    name: string;
    theme: string;
    user_id: number;
    created_at: string;
}

// Folder with sources from API
export interface FolderWithSources extends ApiFolder {
    sources: Source[];
}

export interface FolderResponse {
    status: number;
    message: string;
    data: {
        content: ApiFolder[];
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

export interface FolderDetailResponse {
    status: number;
    message: string;
    data: FolderWithSources;
    timestamp: string;
}

export interface CreateFolderRequest {
    name: string;
    theme: string;
}

export type FolderColorOption = {
    name: string;
    value: string;
};

export type ViewType = 'all' | 'recent' | 'favorites';

export interface FolderFormData {
    name: string;
    color: string;
}

export interface FolderFilterOptions {
    search: string;
    view: ViewType;
}

// Theme to color mapping
export const themeToColorMap: Record<string, string> = {
    'tech': '#2E7CF6', // blue
    'sport': '#F43F5E', // red
    'news': '#10B981', // green
    'finance': '#FBBF24', // yellow
    'entertainment': '#8B5CF6', // purple
    'health': '#EC4899', // pink
    'default': '#64748B', // gray
};

// Helper function to get color from theme
export const getColorFromTheme = (theme: string): string => {
    return themeToColorMap[theme] || themeToColorMap.default;
};

// Helper function to get theme from color
export const getThemeFromColor = (color: string): string => {
    const entry = Object.entries(themeToColorMap).find(([_, value]) => value === color);
    return entry ? entry[0] : 'default';
};

// Convert API folder to frontend folder
export const mapApiToFolder = (apiFolder: ApiFolder, sourcesCount = 0): Folder => {
    return {
        id: apiFolder.id,
        name: apiFolder.name,
        theme: apiFolder.theme,
        color: getColorFromTheme(apiFolder.theme),
        sourcesCount: sourcesCount,
        lastUpdated: new Date(apiFolder.created_at),
        isActive: false,
    };
};

// Convert folder with sources to frontend folder
export const mapFolderWithSourcesToFolder = (folderWithSources: FolderWithSources): Folder => {
    return {
        id: folderWithSources.id,
        name: folderWithSources.name,
        theme: folderWithSources.theme,
        color: getColorFromTheme(folderWithSources.theme),
        sourcesCount: folderWithSources.sources.length,
        lastUpdated: new Date(folderWithSources.created_at),
        isActive: folderWithSources.sources.length > 0,
    };
};