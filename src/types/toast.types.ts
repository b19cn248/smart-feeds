// src/types/toast.types.ts
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    type: ToastType;
    title: string;
    message: string;
}

export interface ToastContextValue {
    toast: Toast | null;
    showToast: (type: ToastType, title: string, message: string) => void;
    hideToast: () => void;
}