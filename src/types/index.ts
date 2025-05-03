// Folder related types
export interface Folder {
    id: string;
    name: string;
    color: string;
    sourcesCount: number;
    lastUpdated: Date;
    isActive?: boolean;
}

// Toast related types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    type: ToastType;
    title: string;
    message: string;
}