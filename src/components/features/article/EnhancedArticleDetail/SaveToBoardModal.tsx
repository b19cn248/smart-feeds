import React, { useState } from 'react';
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
`;

const EmptyBoardsList = styled.div`
    padding: 24px 16px;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const BoardItem = styled.div<{ disabled?: boolean }>`
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: ${({ theme }) => theme.transitions.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    opacity: ${props => props.disabled ? 0.7 : 1};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${({ theme, disabled }) => !disabled ? theme.colors.gray[100] : 'transparent'};
    }
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

const LoadingSpinner = styled.div`
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-left-color: ${({ theme }) => theme.colors.primary.main};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const BoardInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const BoardName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const BoardDescription = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button<{ disabled?: boolean }>`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transitions.default};
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled ? theme.colors.gray[200] : theme.colors.gray[100]};
  }
`;

interface SaveToBoardModalProps {
    article: Article | FolderArticle;
    onClose: () => void;
}

export const SaveToBoardModal: React.FC<SaveToBoardModalProps> = ({ article, onClose }) => {
    const { boards, addArticleToBoard } = useBoard();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState<number | null>(null); // Track which board is loading

    const handleSaveToBoard = async (boardId: number) => {
        try {
            setIsLoading(boardId);
            await addArticleToBoard(boardId, { article_id: article.id });
            showToast('success', 'Article Saved', `"${article.title.substring(0, 30)}${article.title.length > 30 ? '...' : ''}" has been saved to board successfully`);
            onClose();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            showToast('error', 'Save Failed', `Could not save to board. ${errorMessage}`);
        } finally {
            setIsLoading(null);
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
                                onClick={() => !isLoading && handleSaveToBoard(board.id)}
                                disabled={isLoading !== null}
                            >
                                <BoardIcon color={board.color}>
                                    {isLoading === board.id ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <i className={`fas fa-${board.icon || 'clipboard'}`} />
                                    )}
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
                    <CloseButton onClick={onClose} disabled={isLoading !== null}>Close</CloseButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};