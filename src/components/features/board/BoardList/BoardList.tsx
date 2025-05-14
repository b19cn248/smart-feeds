// src/components/features/board/BoardList/BoardList.tsx
import React from 'react';
import styled from 'styled-components';
import { Board } from '../../../../types';
import { BoardCard } from '../BoardCard';
import { gridContainer } from '../../../../styles/mixins';

const BoardGrid = styled.div`
  ${gridContainer}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
`;

// src/components/features/board/BoardList/BoardList.tsx (tiếp)
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

interface BoardListProps {
    boards: Board[];
    onBoardClick?: (boardId: number) => void;
    onEditClick?: (boardId: number) => void;
    onDeleteClick?: (boardId: number) => void;
    searchQuery?: string;
}

export const BoardList: React.FC<BoardListProps> = ({
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
            (board.description && board.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : boards;

    if (filteredBoards.length === 0) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-clipboard" />
                </EmptyStateIcon>
                <EmptyStateText>
                    {searchQuery
                        ? 'No boards found. Try a different search query.'
                        : 'No boards available. Add your first board!'}
                </EmptyStateText>
            </EmptyState>
        );
    }

    return (
        <BoardGrid>
            {filteredBoards.map(board => (
                <BoardCard
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