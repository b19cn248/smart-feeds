// src/types/folder.types.ts
export interface Folder {
    id: string;
    name: string;
    color: string;
    sourcesCount: number;
    lastUpdated: Date;
    isActive?: boolean;
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
