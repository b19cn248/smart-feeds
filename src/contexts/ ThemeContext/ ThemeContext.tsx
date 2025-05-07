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

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Sử dụng hook useTheme đã có sẵn
    const { theme, resolvedTheme, setTheme } = useTheme();

    // Thêm hàm toggleTheme để dễ dàng chuyển đổi theme
    const toggleTheme = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    // Kết hợp lightTheme và darkTheme dựa vào resolvedTheme
    const mergedTheme = resolvedTheme === 'dark'
        ? { ...lightTheme, ...darkTheme }
        : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
            <StyledThemeProvider theme={mergedTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};