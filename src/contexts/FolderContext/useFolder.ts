// src/contexts/FolderContext/useFolder.ts
import { useContext } from 'react';
import { FolderContext } from './FolderContext';

export const useFolder = () => {
    const context = useContext(FolderContext);

    if (!context) {
        throw new Error('useFolder must be used within a FolderProvider');
    }

    return context;
};