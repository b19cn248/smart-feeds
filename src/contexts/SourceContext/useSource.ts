// src/contexts/SourceContext/useSource.ts
import { useContext } from 'react';
import { SourceContext } from './SourceContext';

export const useSource = () => {
    const context = useContext(SourceContext);

    if (!context) {
        throw new Error('useSource must be used within a SourceProvider');
    }

    return context;
};