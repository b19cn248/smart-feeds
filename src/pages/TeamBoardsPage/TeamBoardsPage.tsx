// src/pages/TeamBoardsPage/TeamBoardsPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TeamBoardList } from '../../components/features/teamBoard';
import { TeamBoardForm } from '../../components/features/teamBoard';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useTeamBoard } from '../../contexts/TeamBoardContext';
import { useTeam } from '../../contexts/TeamContext';
import { useDebounce } from '../../hooks';
import { LoadingScreen } from '../../components/common/LoadingScreen';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;

  i {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  max-width: 240px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

export const TeamBoardsPage: React.FC = () => {
    const navigate = useNavigate();
    const { teamBoards, isLoading, error, fetchTeamBoards, createTeamBoard, deleteTeamBoard } = useTeamBoard();
    const { teams, fetchTeams } = useTeam();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debounced search
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Handle board click (navigate to detail page)
    const handleBoardClick = (boardId: number) => {
        navigate(`/team-boards/${boardId}`);
    };

    // Handle board edit
    const handleEditClick = (boardId: number) => {
        navigate(`/team-boards/${boardId}/edit`);
    };

    // Open delete confirmation
    const handleDeleteClick = (boardId: number) => {
        setSelectedBoardId(boardId);
        setShowDeleteModal(true);
    };

    // Confirm board deletion
    const handleConfirmDelete = async () => {
        if (!selectedBoardId) return;

        setIsSubmitting(true);
        const success = await deleteTeamBoard(selectedBoardId);
        setIsSubmitting(false);

        if (success) {
            setShowDeleteModal(false);
            setSelectedBoardId(null);
        }
    };

    // Handle form submission to create board
    const handleCreateBoard = async (name: string, description: string, teamId: number) => {
        setIsSubmitting(true);
        const newBoard = await createTeamBoard(name, description, teamId);
        setIsSubmitting(false);

        if (newBoard) {
            setShowCreateModal(false);
            // Optionally navigate to the new board
            navigate(`/team-boards/${newBoard.id}`);
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchTeamBoards();
        fetchTeams(); // Refresh teams too
    };

    if (isLoading && teamBoards.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-chalkboard" />
                    Team Boards
                </PageTitle>

                <Actions>
                    <SearchWrapper>
                        <Input
                            type="text"
                            placeholder="Search boards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon="search"
                        />
                    </SearchWrapper>

                    <Button onClick={() => setShowCreateModal(true)} leftIcon="plus">
                        Create Board
                    </Button>

                    <Button variant="ghost" onClick={handleRefresh} leftIcon="sync">
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {error && (
                <div style={{ marginBottom: '20px', color: 'red' }}>
                    Error: {error}
                </div>
            )}

            <TeamBoardList
                boards={teamBoards}
                onBoardClick={handleBoardClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                searchQuery={debouncedSearch}
            />

            {/* Create Board Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create Team Board"
                size="sm"
            >
                <TeamBoardForm
                    onSubmit={handleCreateBoard}
                    onCancel={() => setShowCreateModal(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Team Board"
                size="sm"
            >
                <p>Are you sure you want to delete this team board?</p>
                <p>This action cannot be undone.</p>

                <ButtonGroup>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleConfirmDelete}
                        isLoading={isSubmitting}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </Modal>
        </>
    );
};