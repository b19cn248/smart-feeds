// src/pages/BoardsPage/BoardsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BoardList } from '../../components/features/board/BoardList';
import { BoardModal } from '../../components/features/board/BoardModal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useBoard } from '../../contexts/BoardContext';
import { useToast } from '../../contexts/ToastContext';
import { useDebounce } from '../../hooks';
import { BoardCreateRequest, BoardUpdateRequest, Board } from '../../types';
import {Modal} from "../../components/common/Modal";

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

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.error}10`};
  color: ${({ theme }) => theme.colors.error};
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  i {
    margin-right: 8px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  gap: 8px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  min-width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.gray[300]};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.light : 'transparent'};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BoardsPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        boards,
        isLoading,
        error,
        totalPages,
        currentPage,
        fetchBoards,
        createBoard,
        updateBoard,
        deleteBoard
    } = useBoard();
    const { showToast } = useToast();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Navigate to board detail page
    const handleBoardClick = (boardId: number) => {
        navigate(`/boards/${boardId}`);
    };

    // Open edit modal
    const handleEditClick = (boardId: number) => {
        const board = boards.find(b => b.id === boardId);
        if (board) {
            setSelectedBoard(board);
            setShowEditModal(true);
        }
    };

    // Open delete confirmation modal
    const handleDeleteClick = (boardId: number) => {
        const board = boards.find(b => b.id === boardId);
        if (board) {
            setSelectedBoard(board);
            setShowDeleteModal(true);
        }
    };

    // Create a new board
    const handleCreateBoard = async (data: BoardCreateRequest) => {
        try {
            await createBoard(data);
            showToast('success', 'Success', 'Board created successfully');
            setShowCreateModal(false);
        } catch (error) {
            showToast('error', 'Error', 'Failed to create board');
        }
    };

    // Update board
    const handleUpdateBoard = async (data: BoardUpdateRequest) => {
        if (!selectedBoard) return;

        try {
            await updateBoard(selectedBoard.id, data);
            showToast('success', 'Success', 'Board updated successfully');
            setShowEditModal(false);
            setSelectedBoard(null);
        } catch (error) {
            showToast('error', 'Error', 'Failed to update board');
        }
    };

    // Delete board
    const handleDeleteBoard = async () => {
        if (!selectedBoard) return;

        try {
            await deleteBoard(selectedBoard.id);
            showToast('success', 'Success', 'Board deleted successfully');
            setShowDeleteModal(false);
            setSelectedBoard(null);
        } catch (error) {
            showToast('error', 'Error', 'Failed to delete board');
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchBoards(page);
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchBoards(currentPage);
    };

    // Show loading screen while initially loading
    if (isLoading && boards.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-clipboard" />
                    Boards
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
                        Add Board
                    </Button>

                    <Button variant="ghost" onClick={handleRefresh} leftIcon="sync">
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {error && (
                <ErrorMessage>
                    <i className="fas fa-exclamation-circle" />
                    {error}
                </ErrorMessage>
            )}

            <BoardList
                boards={boards}
                onBoardClick={handleBoardClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                searchQuery={debouncedSearch}
            />

            {totalPages > 1 && (
                <Pagination>
                    <PageButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        aria-label="Previous page"
                    >
                        <i className="fas fa-chevron-left" />
                    </PageButton>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <PageButton
                            key={i}
                            isActive={i === currentPage}
                            onClick={() => handlePageChange(i)}
                            aria-label={`Page ${i + 1}`}
                        >
                            {i + 1}
                        </PageButton>
                    ))}

                    <PageButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        aria-label="Next page"
                    >
                        <i className="fas fa-chevron-right" />
                    </PageButton>
                </Pagination>
            )}

            {/* Create Board Modal */}
            <BoardModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateBoard}
                mode="create"
                isLoading={isLoading}
            />

            {/* Edit Board Modal */}
            {selectedBoard && (
                <BoardModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedBoard(null);
                    }}
                    onSubmit={handleUpdateBoard}
                    initialData={{
                        name: selectedBoard.name,
                        description: selectedBoard.description || '',
                        color: selectedBoard.color,
                        icon: selectedBoard.icon,
                        is_public: selectedBoard.is_public
                    }}
                    mode="edit"
                    isLoading={isLoading}
                />
            )}

            {/* Delete Confirmation Modal */}
            {selectedBoard && (
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedBoard(null);
                    }}
                    title="Delete Board"
                    size="sm"
                >
                    <div style={{ padding: '20px 0' }}>
                        <p>Are you sure you want to delete the board "{selectedBoard.name}"?</p>
                        <p>This action cannot be undone.</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setSelectedBoard(null);
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleDeleteBoard}
                            isLoading={isLoading}
                        >
                            Delete
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};