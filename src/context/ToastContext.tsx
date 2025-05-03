import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Toast, ToastType } from '../types';

interface ToastContextProps {
    toast: Toast | null;
    showToast: (type: ToastType, title: string, message: string) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps>({
    toast: null,
    showToast: () => {},
    hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (type: ToastType, title: string, message: string) => {
        setToast({ type, title, message });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const hideToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};