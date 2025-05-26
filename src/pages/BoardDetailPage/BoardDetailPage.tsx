// src/pages/BoardDetailPage/BoardDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useBoard } from '../../contexts/BoardContext';
import { useToast } from '../../contexts/ToastContext';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { BoardModal } from '../../components/features/board/BoardModal';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { AddArticleForm } from '../../components/features/board/AddArticleForm';
import { ArticleMagazineList } from '../../components/features/board/ArticleMagazineList';
import { EnhancedArticleDetail } from '../../components/features/article/EnhancedArticleDetail';
import { BoardUpdateRequest, AddArticleFromUrlRequest, Board, Article } from '../../types';
import { formatDate } from '../../utils';
import { getArticleActionMessage } from '../../utils/notification.utils';

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

const BoardTitleSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const BoardIcon = styled.div<{ color: string }>`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ color }) => `${color}20`};
    display: flex;
    align-items: center;
    justify-content: center;

    i {
        font-size: 24px;
        color: ${({ color }) => color};
    }
`;

const BoardInfo = styled.div`
    flex: 1;
`;

const BoardTitle = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 4px 0;
`;

const BoardDescription = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        justify-content: flex-end;
    }
`;

const BoardMeta = styled.div`
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        gap: 12px;
    }
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};

    i {
        margin-right: 8px;
        font-size: ${({ theme }) => theme.typography.fontSize.md};
    }
`;

const ArticlesSection = styled.div`
    margin-top: 32px;
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 48px 0;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
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

export const BoardDetailPage: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const navigate = useNavigate();
    const {
        selectedBoard,
        isLoading,
        error,
        getBoardById,
        updateBoard,
        deleteBoard,
        addArticleFromUrlToBoard,
        removeArticleFromBoard
    } = useBoard();
    const { showToast } = useToast();

    // Modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddArticleModal, setShowAddArticleModal] = useState(false);
    const [showDeleteArticleModal, setShowDeleteArticleModal] = useState(false);
    const [showArticleDetail, setShowArticleDetail] = useState(false);

    // Selected article state
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [viewingArticle, setViewingArticle] = useState<Article | null>(null);

    // Load board details when component mounts
    useEffect(() => {
        if (boardId) {
            getBoardById(parseInt(boardId, 10));
        }
    }, [boardId, getBoardById]);

    // Handle article click to view detail
    const handleArticleClick = (article: Article) => {
        setViewingArticle(article);
        setShowArticleDetail(true);
    };

    // Handle article delete click
    const handleArticleDeleteClick = (article: Article) => {
        setSelectedArticle(article);
        setShowDeleteArticleModal(true);
    };

    // Handle edit board
    const handleEditBoard = async (data: BoardUpdateRequest) => {
        if (!selectedBoard) return;

        try {
            await updateBoard(selectedBoard.id, data);
            showToast('success', 'Success', 'Board updated successfully');
            setShowEditModal(false);
        } catch (error) {
            showToast('error', 'Error', 'Failed to update board');
        }
    };

    // Handle delete board
    const handleDeleteBoard = async () => {
        if (!selectedBoard) return;

        try {
            await deleteBoard(selectedBoard.id);
            showToast('success', 'Success', 'Board deleted successfully');
            navigate('/boards');
        } catch (error) {
            showToast('error', 'Error', 'Failed to delete board');
        }
    };

    // Handle add article from URL
    const handleAddArticleFromUrl = async (data: AddArticleFromUrlRequest) => {
        if (!selectedBoard) return;

        try {
            await addArticleFromUrlToBoard(selectedBoard.id, data);
            const { type, title, message } = getArticleActionMessage.add.success(data.title || 'Article');
            showToast(type, title, message);
            setShowAddArticleModal(false);
        } catch (error) {
            const { type, title, message } = getArticleActionMessage.add.failure(error as Error);
            showToast(type, title, message);
            throw error;
        }
    };

    // Handle delete article
    const handleDeleteArticle = async () => {
        if (!selectedBoard || !selectedArticle) return;

        try {
            await removeArticleFromBoard(selectedBoard.id, selectedArticle.id);
            const { type, title, message } = getArticleActionMessage.remove.success(selectedArticle.title);
            showToast(type, title, message);
            setShowDeleteArticleModal(false);
            setSelectedArticle(null);
        } catch (error) {
            const { type, title, message } = getArticleActionMessage.remove.failure(error as Error);
            showToast(type, title, message);
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        if (boardId) {
            getBoardById(parseInt(boardId, 10));
        }
    };

    if (isLoading && !selectedBoard) {
        return <LoadingScreen />;
    }

    if (!selectedBoard) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-clipboard" />
                </EmptyStateIcon>
                <EmptyStateText>
                    {error || 'Board not found'}
                </EmptyStateText>
                <Button onClick={() => navigate('/boards')}>
                    Back to Boards
                </Button>
            </EmptyState>
        );
    }

    return (
        <>
            <PageHeader>
                <BoardTitleSection>
                    <BoardIcon color={selectedBoard.color}>
                        <i className={`fas fa-${selectedBoard.icon || 'clipboard'}`} />
                    </BoardIcon>
                    <BoardInfo>
                        <BoardTitle>{selectedBoard.name}</BoardTitle>
                        <BoardDescription>{selectedBoard.description || 'No description'}</BoardDescription>
                    </BoardInfo>
                </BoardTitleSection>

                <Actions>
                    <Button variant="ghost" onClick={handleRefresh} leftIcon="sync">
                        Refresh
                    </Button>
                    <Button variant="secondary" onClick={() => setShowEditModal(true)} leftIcon="edit">
                        Edit
                    </Button>
                    <Button variant="ghost" onClick={() => setShowDeleteModal(true)} leftIcon="trash">
                        Delete
                    </Button>
                </Actions>
            </PageHeader>

            <BoardMeta>
                <MetaItem>
                    <i className="fas fa-calendar" />
                    Created {formatDate(new Date(selectedBoard.created_at))}
                </MetaItem>
                <MetaItem>
                    <i className="fas fa-newspaper" />
                    {selectedBoard.articles ? selectedBoard.articles.length : 0} articles
                </MetaItem>
                <MetaItem>
                    <i className={`fas fa-${selectedBoard.is_public ? 'globe' : 'lock'}`} />
                    {selectedBoard.is_public ? 'Public board' : 'Private board'}
                </MetaItem>
            </BoardMeta>

            <ArticlesSection>
                <SectionTitle>
                    Articles
                    <Button onClick={() => setShowAddArticleModal(true)} size="sm" leftIcon="plus">
                        Add Article
                    </Button>
                </SectionTitle>

                <ArticleMagazineList
                    articles={selectedBoard.articles || []}
                    onArticleClick={handleArticleClick}
                    onDeleteClick={handleArticleDeleteClick}
                    onAddArticleClick={() => setShowAddArticleModal(true)}
                />
            </ArticlesSection>

            {/* Enhanced Article Detail Modal */}
            <EnhancedArticleDetail
                article={viewingArticle}
                isOpen={showArticleDetail}
                onClose={() => setShowArticleDetail(false)}
                teamBoardId=""
            />

            {/* Edit Board Modal */}
            <BoardModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditBoard}
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

            {/* Delete Board Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteBoard}
                title="Delete Board"
                message={`Are you sure you want to delete the board "${selectedBoard.name}"? This action cannot be undone.`}
                isLoading={isLoading}
            />

            {/* Add Article Modal */}
            <Modal
                isOpen={showAddArticleModal}
                onClose={() => setShowAddArticleModal(false)}
                title="Add Article from URL"
                size="md"
            >
                <AddArticleForm
                    onSubmit={handleAddArticleFromUrl}
                    onCancel={() => setShowAddArticleModal(false)}
                    isLoading={isLoading}
                />
            </Modal>

            {/* Delete Article Modal */}
            {selectedArticle && (
                <DeleteConfirmationModal
                    isOpen={showDeleteArticleModal}
                    onClose={() => {
                        setShowDeleteArticleModal(false);
                        setSelectedArticle(null);
                    }}
                    onConfirm={handleDeleteArticle}
                    title="Remove Article"
                    message={`Are you sure you want to remove the article "${selectedArticle.title}" from this board?`}
                    confirmButtonText="Remove"
                    isLoading={isLoading}
                />
            )}
        </>
    );
};