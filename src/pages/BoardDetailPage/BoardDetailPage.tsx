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
import { BoardUpdateRequest, AddArticleFromUrlRequest, Board, Article } from '../../types';
import { formatDate } from '../../utils';

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

  @media (prefers-color-scheme: dark) {
    border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
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

const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ArticleCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[300]};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.colors.gray[700]};

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray[600]};
    }
  }
`;

const ArticleCardContent = styled.div`
  padding: 20px;
`;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ArticleTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ArticleActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  border-radius: ${({ theme }) => theme.radii.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[800]};
    }
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
`;

const ArticleSource = styled.span`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 6px;
  }
`;

const ArticleDate = styled.span`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

// src/pages/BoardDetailPage/BoardDetailPage.tsx (continued)
const ArticleContent = styled.div`
 color: ${({ theme }) => theme.colors.text.secondary};
 font-size: ${({ theme }) => theme.typography.fontSize.md};
 line-height: 1.6;
 margin-bottom: 8px;
 display: -webkit-box;
 -webkit-line-clamp: 3;
 -webkit-box-orient: vertical;
 overflow: hidden;
`;

const ArticleLink = styled.a`
 display: inline-flex;
 align-items: center;
 font-size: ${({ theme }) => theme.typography.fontSize.sm};
 color: ${({ theme }) => theme.colors.primary.main};
 text-decoration: none;

 i {
   margin-left: 6px;
   font-size: 12px;
 }

 &:hover {
   text-decoration: underline;
 }
`;

const EmptyState = styled.div`
 text-align: center;
 padding: 48px 0;
 background-color: ${({ theme }) => theme.colors.background.secondary};
 border-radius: ${({ theme }) => theme.radii.lg};
 border: 2px dashed ${({ theme }) => theme.colors.gray[200]};

 @media (prefers-color-scheme: dark) {
   border-color: ${({ theme }) => theme.colors.gray[700]};
 }
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

const Form = styled.form`
 display: flex;
 flex-direction: column;
 gap: 16px;
`;

const FormGroup = styled.div`
 display: flex;
 flex-direction: column;
 gap: 8px;
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

    // Local state
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddArticleModal, setShowAddArticleModal] = useState(false);
    const [articleUrl, setArticleUrl] = useState('');
    const [articleTitle, setArticleTitle] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [articleNote, setArticleNote] = useState('');
    const [showDeleteArticleModal, setShowDeleteArticleModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // Load board details when component mounts
    useEffect(() => {
        if (boardId) {
            getBoardById(parseInt(boardId, 10));
        }
    }, [boardId, getBoardById]);

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
    const handleAddArticleFromUrl = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBoard || !articleUrl.trim()) return;

        try {
            const data: AddArticleFromUrlRequest = {
                url: articleUrl.trim(),
                title: articleTitle.trim() || undefined,
                content: articleContent.trim() || undefined,
                note: articleNote.trim() || undefined
            };

            await addArticleFromUrlToBoard(selectedBoard.id, data);
            showToast('success', 'Success', 'Article added to board successfully');
            setShowAddArticleModal(false);
            // Reset form fields
            setArticleUrl('');
            setArticleTitle('');
            setArticleContent('');
            setArticleNote('');
        } catch (error) {
            showToast('error', 'Error', 'Failed to add article to board');
        }
    };

    // Handle delete article
    const handleDeleteArticle = async () => {
        if (!selectedBoard || !selectedArticle) return;

        try {
            await removeArticleFromBoard(selectedBoard.id, selectedArticle.id);
            showToast('success', 'Success', 'Article removed from board successfully');
            setShowDeleteArticleModal(false);
            setSelectedArticle(null);
        } catch (error) {
            showToast('error', 'Error', 'Failed to remove article from board');
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

    const hasArticles = selectedBoard.articles && selectedBoard.articles.length > 0;

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

                {hasArticles ? (
                    <ArticleList>
                        {selectedBoard.articles!.map((article) => (
                            <ArticleCard key={article.id}>
                                <ArticleCardContent>
                                    <ArticleHeader>
                                        <ArticleTitle>{article.title}</ArticleTitle>
                                        <ArticleActions>
                                            <ActionButton
                                                onClick={() => {
                                                    setSelectedArticle(article);
                                                    setShowDeleteArticleModal(true);
                                                }}
                                                title="Remove from board"
                                            >
                                                <i className="fas fa-times" />
                                            </ActionButton>
                                        </ArticleActions>
                                    </ArticleHeader>
                                    <ArticleMeta>
                                        <ArticleSource>
                                            <i className="fas fa-newspaper" />
                                            {typeof article.source === 'string' ? article.source : 'Unknown source'}
                                        </ArticleSource>
                                        <ArticleDate>
                                            {formatDate(new Date(article.publish_date))}
                                        </ArticleDate>
                                    </ArticleMeta>
                                    <ArticleContent>
                                        {article.content}
                                    </ArticleContent>
                                    <ArticleLink href={article.url} target="_blank" rel="noopener noreferrer">
                                        Read full article
                                        <i className="fas fa-external-link-alt" />
                                    </ArticleLink>
                                </ArticleCardContent>
                            </ArticleCard>
                        ))}
                    </ArticleList>
                ) : (
                    <EmptyState>
                        <EmptyStateIcon>
                            <i className="fas fa-newspaper" />
                        </EmptyStateIcon>
                        <EmptyStateText>
                            No articles in this board yet
                        </EmptyStateText>
                        <Button onClick={() => setShowAddArticleModal(true)} leftIcon="plus">
                            Add Article
                        </Button>
                    </EmptyState>
                )}
            </ArticlesSection>

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
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
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
                        onClick={() => setShowDeleteModal(false)}
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

            {/* Add Article Modal */}
            <Modal
                isOpen={showAddArticleModal}
                onClose={() => setShowAddArticleModal(false)}
                title="Add Article from URL"
                size="md"
            >
                <Form onSubmit={handleAddArticleFromUrl}>
                    <FormGroup>
                        <label htmlFor="article-url">Article URL (required)</label>
                        <input
                            id="article-url"
                            type="url"
                            value={articleUrl}
                            onChange={(e) => setArticleUrl(e.target.value)}
                            placeholder="https://example.com/article"
                            className="form-control"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="article-title">Title (optional)</label>
                        <input
                            id="article-title"
                            type="text"
                            value={articleTitle}
                            onChange={(e) => setArticleTitle(e.target.value)}
                            placeholder="Enter article title"
                            className="form-control"
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="article-content">Content (optional)</label>
                        <textarea
                            id="article-content"
                            value={articleContent}
                            onChange={(e) => setArticleContent(e.target.value)}
                            placeholder="Enter article content"
                            className="form-control"
                            rows={4}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="article-note">Personal note (optional)</label>
                        <textarea
                            id="article-note"
                            value={articleNote}
                            onChange={(e) => setArticleNote(e.target.value)}
                            placeholder="Add a personal note about this article"
                            className="form-control"
                            rows={2}
                        />
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowAddArticleModal(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={!articleUrl.trim()}
                        >
                            Add Article
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Delete Article Modal */}
            {selectedArticle && (
                <Modal
                    isOpen={showDeleteArticleModal}
                    onClose={() => {
                        setShowDeleteArticleModal(false);
                        setSelectedArticle(null);
                    }}
                    title="Remove Article"
                    size="sm"
                >
                    <div style={{ padding: '20px 0' }}>
                        <p>Are you sure you want to remove the article "{selectedArticle.title}" from this board?</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowDeleteArticleModal(false);
                                setSelectedArticle(null);
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleDeleteArticle}
                            isLoading={isLoading}
                        >
                            Remove
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

