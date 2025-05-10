// src/components/features/board/BoardCard/BoardCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Board } from '../../../../types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';
import { iconButton } from '../../../../styles/mixins';

const BoardContent = styled.div`
  padding: 20px;
`;

const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const BoardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ color }) => `${color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;

  i {
    font-size: 18px;
    color: ${({ color }) => color};
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

const BoardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BoardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-top: 12px;

  @media (prefers-color-scheme: dark) {
    border-top-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const BoardArticleCount = styled.div`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 6px;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const BoardDate = styled.div``;

const BoardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  ${iconButton}
`;

interface BoardCardProps {
    board: Board;
    onClick?: () => void;
    onEditClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({
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

    // Số lượng bài viết trong board
    const articleCount = board.articles ? board.articles.length : 0;

    return (
        <Card onClick={onClick}>
            <BoardContent>
                <BoardHeader>
                    <BoardIcon color={board.color}>
                        <i className={`fas fa-${board.icon || 'clipboard'}`} />
                    </BoardIcon>
                    <BoardInfo>
                        <BoardName>{board.name}</BoardName>
                        <BoardDescription>{board.description || 'No description'}</BoardDescription>
                    </BoardInfo>
                </BoardHeader>

                <BoardMeta>
                    <BoardArticleCount>
                        <i className="fas fa-newspaper" />
                        {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                    </BoardArticleCount>
                    <BoardDate>{formatDate(new Date(board.created_at))}</BoardDate>
                </BoardMeta>

                <BoardActions>
                    <ActionButton onClick={handleEditClick} title="Edit board">
                        <i className="fas fa-edit" />
                    </ActionButton>
                    <ActionButton onClick={handleDeleteClick} title="Delete board">
                        <i className="fas fa-trash" />
                    </ActionButton>
                </BoardActions>
            </BoardContent>
        </Card>
    );
};