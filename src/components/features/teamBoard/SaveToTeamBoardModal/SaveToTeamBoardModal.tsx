import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTeamBoard } from '../../../../contexts/TeamBoardContext';
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
`;

const BoardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.primary.light};
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    color: ${({ theme }) => theme.colors.primary.main};
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
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  
  i {
    margin-right: 8px;
    animation: spin 1s linear infinite;
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
`;

interface SaveToTeamBoardModalProps {
    article: Article | FolderArticle;
    onClose: () => void;
}

export const SaveToTeamBoardModal: React.FC<SaveToTeamBoardModalProps> = ({ article, onClose }) => {
    const { teamBoards, fetchTeamBoards, addArticleToTeamBoard, isLoading } = useTeamBoard();
    const { showToast } = useToast();

    // Fetch team boards when component mounts
    useEffect(() => {
        fetchTeamBoards();
    }, [fetchTeamBoards]);

    const handleSaveToBoard = async (boardId: number) => {
        try {
            const success = await addArticleToTeamBoard(boardId, article.id);

            if (success) {
                showToast('success', 'Success', 'Article saved to team board successfully');
                onClose();
            } else {
                showToast('error', 'Error', 'Failed to save article to team board');
            }
        } catch (error) {
            console.error('Error saving to team board:', error);
            showToast('error', 'Error', 'Failed to save article to team board');
        }
    };

    return (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <ModalContainer>
                <ModalTitle>Save to Team Board</ModalTitle>
                <ModalDescription>Select a team board to save this article:</ModalDescription>

                {isLoading ? (
                    <LoadingContainer>
                        <i className="fas fa-circle-notch"></i>
                        Loading team boards...
                    </LoadingContainer>
                ) : (
                    <BoardsList>
                        {teamBoards.length > 0 ? (
                            teamBoards.map(board => (
                                <BoardItem
                                    key={board.id}
                                    onClick={() => handleSaveToBoard(board.id)}
                                >
                                    <BoardIcon>
                                        <i className="fas fa-chalkboard" />
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
                                You don't have any team boards. Create a team board first to save articles.
                            </EmptyBoardsList>
                        )}
                    </BoardsList>
                )}

                <ModalFooter>
                    <CloseButton onClick={onClose}>Close</CloseButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};