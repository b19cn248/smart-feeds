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
    onAddToFolderClick?: (sourceId: number) => void;
    searchQuery?: string;
}

export const SourceList: React.FC<SourceListProps> = ({
                                                          sources,
                                                          onSourceClick,
                                                          onEditClick,
                                                          onDeleteClick,
                                                          onAddToFolderClick,
                                                          searchQuery = ''
                                                      }) => {
    // Lọc bỏ các sources null/undefined và filter theo search query
    const validSources = sources.filter((source): source is Source => {
        // Kiểm tra source không null/undefined và có id
        if (!source || typeof source !== 'object' || !source.id) {
            console.warn('Invalid source found in array:', source);
            return false;
        }
        return true;
    });

    // Filter sources by search query
    const filteredSources = searchQuery
        ? validSources.filter(source =>
            source.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            source.url?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : validSources;

    // Log để debug nếu cần
    if (process.env.NODE_ENV === 'development') {
        const invalidCount = sources.length - validSources.length;
        if (invalidCount > 0) {
            console.warn(`Found ${invalidCount} invalid sources in array`);
        }
    }

    if (filteredSources.length === 0) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-rss" />
                </EmptyStateIcon>
                <EmptyStateText>
                    {searchQuery
                        ? 'No sources found. Try a different search query.'
                        : validSources.length === 0
                            ? 'No sources available. Add your first source!'
                            : 'No sources match your search criteria.'}
                </EmptyStateText>
            </EmptyState>
        );
    }

    return (
        <SourceGrid>
            {filteredSources.map(source => {
                // Double-check tại đây để đảm bảo an toàn
                if (!source || !source.id) {
                    console.error('Invalid source passed to SourceCard:', source);
                    return null;
                }

                return (
                    <SourceCard
                        key={source.id}
                        source={source}
                        onClick={() => onSourceClick?.(source.id)}
                        onEditClick={() => onEditClick?.(source.id)}
                        onDeleteClick={() => onDeleteClick?.(source.id)}
                        onAddToFolderClick={() => onAddToFolderClick?.(source.id)}
                    />
                );
            })}
        </SourceGrid>
    );
};