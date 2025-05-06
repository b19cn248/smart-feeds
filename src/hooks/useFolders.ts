// src/hooks/useFolders.ts
import { useMemo } from 'react';
import { FolderFilterOptions, ViewType } from '../types';
import { useFolder } from '../contexts/FolderContext';

export const useFilteredFolders = (options: FolderFilterOptions) => {
    const { folders } = useFolder();

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