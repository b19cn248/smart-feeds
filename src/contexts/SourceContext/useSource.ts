// src/contexts/SourceContext/useSource.ts
import { useContext } from 'react';
import { SourceContext } from './SourceContext';

export const useSource = () => {
    const context = useContext(SourceContext);

    if (!context) {
        throw new Error('useSource must be used within a SourceProvider');
    }

    // ✅ DEBUG: Log available methods trong development
    if (process.env.NODE_ENV === 'development') {
        console.log('🔍 useSource hook methods available:', {
            sources: context.sources.length,
            isLoading: context.isLoading,
            methods: Object.keys(context).filter(key => typeof context[key as keyof typeof context] === 'function')
        });
    }

    return context;
};