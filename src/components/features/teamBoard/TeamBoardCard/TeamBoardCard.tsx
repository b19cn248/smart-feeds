// src/components/features/teamBoard/TeamBoardCard/TeamBoardCard.tsx
import React from 'react';
import styled from 'styled-components';
import { TeamBoard } from '../../../../types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';

const BoardContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const BoardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const BoardIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => `${theme.colors.primary.main}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
        font-size: 18px;
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const BoardInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const BoardName = styled.h3`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const BoardTeam = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const BoardDescription = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const BoardMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    padding-top: 12px;
    margin-top: 10px;
`;

const BoardDate = styled.div``;

const BoardActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.text.primary};
    }
`;

interface TeamBoardCardProps {
    board: TeamBoard;
    onClick?: () => void;
    onEditClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
}

export const TeamBoardCard: React.FC<TeamBoardCardProps> = ({
                                                                board,
                                                                onClick,
                                                                onEditClick,
                                                                onDeleteClick
                                                            }) => {
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEditClick) onEditClick(e);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDeleteClick) onDeleteClick(e);
    };

    return (
        <Card onClick={onClick}>
            <BoardContent>
                <BoardHeader>
                    <BoardIcon>
                        <i className="fas fa-chalkboard" />
                    </BoardIcon>
                    <BoardInfo>
                        <BoardName title={board.name}>{board.name}</BoardName>
                        <BoardTeam>{board.team_name}</BoardTeam>
                    </BoardInfo>
                </BoardHeader>

                <BoardDescription>{board.description || 'No description provided'}</BoardDescription>

                <BoardMeta>
                    <BoardDate>Created: {formatDate(new Date(board.created_at))}</BoardDate>
                    <BoardActions>
                        <ActionButton onClick={handleEditClick} title="Edit board">
                            <i className="fas fa-edit" />
                        </ActionButton>
                        <ActionButton onClick={handleDeleteClick} title="Delete board">
                            <i className="fas fa-trash" />
                        </ActionButton>
                    </BoardActions>
                </BoardMeta>
            </BoardContent>
        </Card>
    );
};