// src/components/features/article/EnhancedArticleDetail/SaveToBoardModal.tsx
import React from 'react';
import styled from 'styled-components';
import { useBoard } from '../../../../contexts/BoardContext';
import { useToast } from '../../../../contexts/ToastContext';
import { Article } from '../../../../types';
import { FolderArticle } from '../../../../types/folderArticles.types';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 500px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ModalDescription = styled.p`
  margin-top: 0;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const BoardsList = styled.div`
  margin-top: 16px;
  margin-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const EmptyBoardsList = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const BoardItem = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  @media (prefers-color-scheme: dark) {
    border-bottom-color: ${({ theme }) => theme.colors.gray[700]};

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[800]};
    }
  }
`;

const BoardIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ color }) => `${color}20`};
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    color: ${({ color }) => color};
    font-size: 18px;
  }
`;

const BoardInfo = styled.div`
  flex: 1;
`;

const BoardName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: 4px;
`;

const BoardDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[200]};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[700]};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[600]};
    }
  }
`;

interface SaveToBoardModalProps {
    article: Article | FolderArticle;
    onClose: () => void;
}

export const SaveToBoardModal: React.FC<SaveToBoardModalProps> = ({ article, onClose }) => {
    const { boards, addArticleToBoard } = useBoard();
    const { showToast } = useToast();

    const handleSaveToBoard = async (boardId: number) => {
        try {
            await addArticleToBoard(boardId, { article_id: article.id });
            showToast('success', 'Success', 'Article saved to board successfully');
            onClose();
        } catch (error) {
            showToast('error', 'Error', 'Failed to save article to board');
        }
    };

    return (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <ModalContainer>
                <ModalTitle>Save to Board</ModalTitle>
                <ModalDescription>Select a board to save this article:</ModalDescription>

                <BoardsList>
                    {boards.length > 0 ? (
                        boards.map(board => (
                            <BoardItem
                                key={board.id}
                                onClick={() => handleSaveToBoard(board.id)}
                            >
                                <BoardIcon color={board.color}>
                                    <i className={`fas fa-${board.icon || 'clipboard'}`} />
                                </BoardIcon>
                                <BoardInfo>
                                    <BoardName>{board.name}</BoardName>
                                    {board.description && (
                                        <BoardDescription>{board.description}</BoardDescription>
                                    )}
                                </BoardInfo>
                            </BoardItem>
                        ))
                    ) : (
                        <EmptyBoardsList>
                            You don't have any boards. Create a board first to save articles.
                        </EmptyBoardsList>
                    )}
                </BoardsList>

                <ModalFooter>
                    <CloseButton onClick={onClose}>Close</CloseButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};