// src/hooks/useFolders.ts
import { useContext, useMemo } from 'react';
import { FolderContext } from '../contexts/FolderContext';
import { Folder, FolderFilterOptions, ViewType } from '../types';

export const useFolders = () => {
    const context = useContext(FolderContext);

    if (!context) {
        throw new Error('useFolders must be used within a FolderProvider');
    }

    return context;
};

export const useFilteredFolders = (options: FolderFilterOptions) => {
    const { folders } = useFolders();

    const filteredFolders = useMemo(() => {
        return folders.filter(folder => {
            // Filter by search query
            const matchesSearch = options.search === '' ||
                folder.name.toLowerCase().includes(options.search.toLowerCase());

            // Filter by view type
            let matchesView = true;
            if (options.view === 'recent') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                matchesView = folder.lastUpdated > oneWeekAgo;
            } else if (options.view === 'favorites') {
                matchesView = folder.isActive === true;
            }

            return matchesSearch && matchesView;
        });
    }, [folders, options.search, options.view]);

    return filteredFolders;
};