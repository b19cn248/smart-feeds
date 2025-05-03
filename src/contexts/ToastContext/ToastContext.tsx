// src/contexts/ToastContext/ToastContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Toast, ToastType } from '../../types';
import { generateId } from '../../utils';

// Extended toast interface with id
interface ToastWithId extends Toast {
    id: string;
}

// Action types
type ToastAction =
    | { type: 'ADD_TOAST'; payload: ToastWithId }
    | { type: 'REMOVE_TOAST'; payload: string }
    | { type: 'CLEAR_TOASTS' };

// Context value interface
interface ToastContextValue {
    toasts: ToastWithId[];
    showToast: (type: ToastType, title: string, message: string) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
    // Legacy properties for backward compatibility
    toast: Toast | null;
    hideToast: () => void;
}

// Initial state
const initialState: ToastWithId[] = [];

// Reducer
const toastReducer = (state: ToastWithId[], action: ToastAction): ToastWithId[] => {
    switch (action.type) {
        case 'ADD_TOAST':
            return [...state, action.payload];

        case 'REMOVE_TOAST':
            return state.filter(toast => toast.id !== action.payload);

        case 'CLEAR_TOASTS':
            return [];

        default:
            return state;
    }
};

// Create context
export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, dispatch] = useReducer(toastReducer, initialState);

    const showToast = useCallback((type: ToastType, title: string, message: string) => {
        const newToast: ToastWithId = {
            id: generateId(),
            type,
            title,
            message,
        };

        dispatch({ type: 'ADD_TOAST', payload: newToast });

        // Auto-remove toast after duration
        setTimeout(() => {
            dispatch({ type: 'REMOVE_TOAST', payload: newToast.id });
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, []);

    const clearToasts = useCallback(() => {
        dispatch({ type: 'CLEAR_TOASTS' });
    }, []);

    // Legacy compatibility
    const toast = toasts.length > 0 ? toasts[toasts.length - 1] : null;
    const hideToast = useCallback(() => {
        if (toast) {
            removeToast(toast.id);
        }
    }, [toast, removeToast]);

    const value = {
        toasts,
        showToast,
        removeToast,
        clearToasts,
        // Legacy
        toast,
        hideToast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};
