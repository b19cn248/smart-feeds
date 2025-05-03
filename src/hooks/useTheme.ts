// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');

            const handleChange = (e: MediaQueryListEvent) => {
                setResolvedTheme(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    return {
        theme,
        setTheme,
        resolvedTheme,
    };
};