// src/components/features/source/SourceList/SourceList.tsx
import React from 'react';
import styled from 'styled-components';
import { Source } from '../../../../types';
import { SourceCard } from '../SourceCard';
import { gridContainer } from '../../../../styles/mixins';

const SourceGrid = styled.div`
    ${gridContainer}
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 48px 0;
`;

const EmptyStateIcon = styled.div`
    font-size: 48px;
    color: ${({ theme }) => theme.colors.gray[400]};
    margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 24px;
`;

interface SourceListProps {
    sources: Source[];
    onSourceClick?: (sourceId: number) => void;
    onEditClick?: (sourceId: number) => void;
    onDeleteClick?: (sourceId: number) => void;
    onAddToFolderClick?: (sourceId: number) => void; // Thêm prop mới
    searchQuery?: string;
}

export const SourceList: React.FC<SourceListProps> = ({
                                                          sources,
                                                          onSourceClick,
                                                          onEditClick,
                                                          onDeleteClick,
                                                          onAddToFolderClick, // Thêm prop mới
                                                          searchQuery = ''
                                                      }) => {
    // Filter sources by search query
    const filteredSources = searchQuery
        ? sources.filter(source =>
            source.url.toLowerCase().includes(searchQuery.toLowerCase()))
        : sources;

    if (filteredSources.length === 0) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-rss" />
                </EmptyStateIcon>
                <EmptyStateText>
                    {searchQuery
                        ? 'No sources found. Try a different search query.'
                        : 'No sources available. Add your first source!'}
                </EmptyStateText>
            </EmptyState>
        );
    }

    return (
        <SourceGrid>
            {filteredSources.map(source => (
                <SourceCard
                    key={source.id}
                    source={source}
                    onClick={() => onSourceClick?.(source.id)}
                    onEditClick={() => onEditClick?.(source.id)}
                    onDeleteClick={() => onDeleteClick?.(source.id)}
                    onAddToFolderClick={() => onAddToFolderClick?.(source.id)} // Thêm prop mới
                />
            ))}
        </SourceGrid>
    );
};