// src/components/features/folder/FolderList/FolderList.tsx
import React from 'react';
import styled from 'styled-components';
import { FolderCard } from '../FolderCard';
import { EmptyState } from './EmptyState';
import { useFilteredFolders } from '../../../../hooks';
import { FolderFilterOptions } from '../../../../types';
import { gridContainer } from '../../../../styles/mixins';

const FolderGrid = styled.div`
    ${gridContainer}
`;

interface FolderListProps {
    filters: FolderFilterOptions;
    onFolderClick?: (folderId: number) => void;
    onFolderMenuClick?: (folderId: number, event?: React.MouseEvent) => void;
    onCreateClick?: () => void;
}

export const FolderList: React.FC<FolderListProps> = ({
                                                          filters,
                                                          onFolderClick,
                                                          onFolderMenuClick,
                                                          onCreateClick
                                                      }) => {
    const filteredFolders = useFilteredFolders(filters);

    if (filteredFolders.length === 0) {
        return (
            <EmptyState
                searchQuery={filters.search}
                onCreateClick={onCreateClick}
            />
        );
    }

    return (
        <FolderGrid>
            {filteredFolders.map((folder) => (
                <FolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={() => onFolderClick?.(folder.id)}
                    onEdit={() => onFolderMenuClick?.(folder.id, undefined)}
                />
            ))}
        </FolderGrid>
    );
};