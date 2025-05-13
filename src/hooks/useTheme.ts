// src/hooks/useTheme.ts
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
    // Lấy giá trị theme từ localStorage hoặc mặc định là 'system'
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    // Cập nhật theme khi có thay đổi và lưu vào localStorage
    useEffect(() => {
        const updateResolvedTheme = () => {
            if (theme === 'system') {
                // Chỉ kiểm tra preference của hệ thống khi người dùng chọn 'system'
                const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                setResolvedTheme(systemPreference);
            } else {
                setResolvedTheme(theme);
            }
        };

        updateResolvedTheme();
        localStorage.setItem('theme', theme);

        // Theo dõi thay đổi từ hệ thống nếu theme là 'system'
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                updateResolvedTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return { theme, resolvedTheme, setTheme };
};