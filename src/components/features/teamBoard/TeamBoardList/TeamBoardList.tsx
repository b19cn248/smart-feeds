// src/components/features/teamBoard/TeamBoardList/TeamBoardList.tsx
import React from 'react';
import styled from 'styled-components';
import { TeamBoard } from '../../../../types';
import { TeamBoardCard } from '../TeamBoardCard';
import { gridContainer } from '../../../../styles/mixins';

const BoardGrid = styled.div`
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

interface TeamBoardListProps {
    boards: TeamBoard[];
    onBoardClick?: (boardId: number) => void;
    onEditClick?: (boardId: number) => void;
    onDeleteClick?: (boardId: number) => void;
    searchQuery?: string;
}

export const TeamBoardList: React.FC<TeamBoardListProps> = ({
                                                                boards,
                                                                onBoardClick,
                                                                onEditClick,
                                                                onDeleteClick,
                                                                searchQuery = ''
                                                            }) => {
    // Filter boards by search query
    const filteredBoards = searchQuery
        ? boards.filter(board =>
            board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            board.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            board.team_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : boards;

    if (filteredBoards.length === 0) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-chalkboard" />
                </EmptyStateIcon>
                <EmptyStateText>
                    {searchQuery
                        ? 'No boards found. Try a different search query.'
                        : 'No boards available. Create your first team board!'}
                </EmptyStateText>
            </EmptyState>
        );
    }

    return (
        <BoardGrid>
            {filteredBoards.map(board => (
                <TeamBoardCard
                    key={board.id}
                    board={board}
                    onClick={() => onBoardClick?.(board.id)}
                    onEditClick={() => onEditClick?.(board.id)}
                    onDeleteClick={() => onDeleteClick?.(board.id)}
                />
            ))}
        </BoardGrid>
    );
};