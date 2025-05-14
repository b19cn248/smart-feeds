// src/contexts/ThemeContext/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme as lightTheme, darkTheme } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';

interface ThemeContextType {
    theme: 'light' | 'dark' | 'system';
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};

// Hàm deep merge để kết hợp theme tốt hơn
const deepMerge = (target: any, source: any) => {
    const result = { ...target };

    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Sử dụng hook useTheme đã cập nhật
    const { theme, resolvedTheme, setTheme } = useTheme();

    // Hàm toggleTheme để dễ dàng chuyển đổi theme
    const toggleTheme = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    // Kết hợp lightTheme và darkTheme dựa vào resolvedTheme
    const mergedTheme = resolvedTheme === 'dark'
        ? deepMerge(lightTheme, darkTheme)
        : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
            <StyledThemeProvider theme={mergedTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};