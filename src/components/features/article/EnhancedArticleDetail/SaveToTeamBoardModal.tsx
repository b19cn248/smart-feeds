import React, { useEffect, useState } from 'react';
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

const TeamBoardsList = styled.div`
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

const TeamBoardItem = styled.div<{ disabled?: boolean }>`
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

const TeamBoardIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => theme.colors.primary.light};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
        font-size: 18px;
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const TeamBoardInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const TeamBoardName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TeamBoardTeam = styled.div`
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

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  
  p {
    margin-top: 12px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

interface SaveToTeamBoardModalProps {
    article: Article | FolderArticle;
    onClose: () => void;
}

export const SaveToTeamBoardModal: React.FC<SaveToTeamBoardModalProps> = ({ article, onClose }) => {
    const { teamBoards, fetchTeamBoards, addArticleToTeamBoard } = useTeamBoard();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState<number | null>(null); // Track which board is loading
    const [isFetchingBoards, setIsFetchingBoards] = useState(false);

    // Fetch team boards when component mounts
    useEffect(() => {
        const getTeamBoards = async () => {
            setIsFetchingBoards(true);
            try {
                await fetchTeamBoards();
            } catch (error) {
                showToast('error', 'Error', 'Could not load team boards. Please try again.');
            } finally {
                setIsFetchingBoards(false);
            }
        };

        getTeamBoards();
    }, [fetchTeamBoards, showToast]);

    const handleSaveToTeamBoard = async (boardId: number) => {
        try {
            setIsLoading(boardId);
            const success = await addArticleToTeamBoard(boardId, article.id);

            if (success) {
                showToast('success', 'Article Saved', `"${article.title.substring(0, 30)}${article.title.length > 30 ? '...' : ''}" has been saved to team board successfully`);
                onClose();
            } else {
                // Handle case where API returns success: false
                showToast('warning', 'Not Saved', 'The article could not be saved. It may already exist in this board.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            showToast('error', 'Save Failed', `Could not save to team board. ${errorMessage}`);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <ModalContainer>
                <ModalTitle>Save to Team Board</ModalTitle>
                <ModalDescription>Select a team board to save this article:</ModalDescription>

                <TeamBoardsList>
                    {isFetchingBoards ? (
                        <LoadingState>
                            <LoadingSpinner />
                            <p>Loading team boards...</p>
                        </LoadingState>
                    ) : teamBoards.length > 0 ? (
                        teamBoards.map(board => (
                            <TeamBoardItem
                                key={board.id}
                                onClick={() => !isLoading && handleSaveToTeamBoard(board.id)}
                                disabled={isLoading !== null}
                            >
                                <TeamBoardIcon>
                                    {isLoading === board.id ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <i className="fas fa-chalkboard" />
                                    )}
                                </TeamBoardIcon>
                                <TeamBoardInfo>
                                    <TeamBoardName>{board.name}</TeamBoardName>
                                    <TeamBoardTeam>{board.team_name}</TeamBoardTeam>
                                </TeamBoardInfo>
                            </TeamBoardItem>
                        ))
                    ) : (
                        <EmptyBoardsList>
                            You don't have any team boards. Create a team board first to save articles.
                        </EmptyBoardsList>
                    )}
                </TeamBoardsList>

                <ModalFooter>
                    <CloseButton onClick={onClose} disabled={isLoading !== null}>Close</CloseButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};