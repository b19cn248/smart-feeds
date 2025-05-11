// src/pages/ArticlesPage/ArticlesPage.tsx
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {FolderArticle, FolderWithArticles} from '../../types/folderArticles.types';
import {folderArticlesService} from '../../services/folderArticlesService';
import {Input} from '../../components/common/Input';
import {Button} from '../../components/common/Button';
import {LoadingScreen} from '../../components/common/LoadingScreen';
import {useDebounce} from '../../hooks';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {ViewMode, ViewSelector} from '../../components/features/article/ViewSelector';
import {ArticleView} from '../../components/features/article/ViewModes';
import {EnhancedArticleDetail} from '../../components/features/article/EnhancedArticleDetail';
import {useBoard} from '../../contexts/BoardContext';
import {useToast} from '../../contexts/ToastContext';
import {FolderArticlesSection} from '../../components/features/article/FolderArticlesSection';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 64px);
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;

    @media (max-width: ${({theme}) => theme.breakpoints.sm}) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const PageTitle = styled.h1`
    font-size: ${({theme}) => theme.typography.fontSize['3xl']};
    font-weight: ${({theme}) => theme.typography.fontWeight.bold};
    color: ${({theme}) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;

    i {
        color: ${({theme}) => theme.colors.primary.main};
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: ${({theme}) => theme.breakpoints.sm}) {
        width: 100%;
        justify-content: space-between;
    }
`;

const SearchWrapper = styled.div`
    position: relative;
    width: 240px;

    @media (max-width: ${({theme}) => theme.breakpoints.sm}) {
        width: 100%;
    }
`;

const FilterBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 12px 16px;
    background-color: ${({theme}) => theme.colors.background.secondary};
    border-radius: ${({theme}) => theme.radii.lg};
    box-shadow: ${({theme}) => theme.shadows.sm};

    @media (max-width: ${({theme}) => theme.breakpoints.sm}) {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    @media (prefers-color-scheme: dark) {
        background-color: ${({theme}) => theme.colors.gray[800]};
    }
`;

const FilterActions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;

    @media (max-width: ${({theme}) => theme.breakpoints.sm}) {
        width: 100%;
        justify-content: space-between;
    }
`;

const SortSelect = styled.select`
    padding: 8px 12px;
    border-radius: ${({theme}) => theme.radii.md};
    border: 1px solid ${({theme}) => theme.colors.gray[300]};
    background-color: ${({theme}) => theme.colors.background.secondary};
    color: ${({theme}) => theme.colors.text.primary};
    font-size: ${({theme}) => theme.typography.fontSize.sm};

    @media (prefers-color-scheme: dark) {
        background-color: ${({theme}) => theme.colors.gray[800]};
        border-color: ${({theme}) => theme.colors.gray[600]};
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 48px 0;
    background-color: ${({theme}) => theme.colors.background.secondary};
    border-radius: ${({theme}) => theme.radii.lg};
    border: 2px dashed ${({theme}) => theme.colors.gray[200]};
    margin-top: 24px;

    @media (prefers-color-scheme: dark) {
        background-color: ${({theme}) => theme.colors.gray[800]};
        border-color: ${({theme}) => theme.colors.gray[700]};
    }
`;

const EmptyStateIcon = styled.div`
    font-size: 48px;
    color: ${({theme}) => theme.colors.gray[400]};
    margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
    font-size: ${({theme}) => theme.typography.fontSize.lg};
    color: ${({theme}) => theme.colors.text.secondary};
    margin-bottom: 24px;
`;

const ArticlesContainer = styled.div<{ view: ViewMode }>`
    flex: 1;
    background-color: ${({view, theme}) =>
            view === 'title-only' ? theme.colors.background.secondary : 'transparent'};
    border-radius: ${({view, theme}) =>
            view === 'title-only' ? theme.radii.lg : '0'};
    overflow: hidden;

    @media (prefers-color-scheme: dark) {
        background-color: ${({view, theme}) =>
                view === 'title-only' ? theme.colors.gray[800] : 'transparent'};
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
    border-radius: ${({theme}) => theme.radii.md};
    border: 1px solid ${({isActive, theme}) =>
            isActive ? theme.colors.primary.main : theme.colors.gray[300]};
    background-color: ${({isActive, theme}) =>
            isActive ? theme.colors.primary.light : 'transparent'};
    color: ${({isActive, theme}) =>
            isActive ? theme.colors.primary.main : theme.colors.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: ${({theme}) => theme.transitions.default};

    &:hover:not(:disabled) {
        background-color: ${({theme}) => theme.colors.gray[100]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ArticlesPage: React.FC = () => {
    // State
    const [folders, setFolders] = useState<FolderWithArticles[]>([]);
    const [filteredFolders, setFilteredFolders] = useState<FolderWithArticles[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<FolderArticle | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [viewMode, setViewMode] = useLocalStorage<ViewMode>('article-view-mode', 'magazine');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Hooks
    const debouncedSearch = useDebounce(searchQuery, 300);
    const {boards, addArticleToBoard} = useBoard();
    const {showToast} = useToast();

    // Fetch folders with articles
    useEffect(() => {
        fetchFoldersWithArticles();
    }, [currentPage]);

    const fetchFoldersWithArticles = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Sử dụng các thông số API đúng theo tài liệu
            const response = await folderArticlesService.getFoldersWithArticles(
                currentPage,     // page
                10,              // size
                'createdAt,DESC', // sort
                6             // article_size
            );
            setFolders(response.data.content);
            setFilteredFolders(response.data.content);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching folders with articles:', error);
            setError('Failed to load articles. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter folders based on search query
    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setFilteredFolders(folders);
            return;
        }

        const lowerCaseQuery = debouncedSearch.toLowerCase();
        const filtered = folders.filter(folder => {
            // Search in folder name
            if (folder.name.toLowerCase().includes(lowerCaseQuery)) {
                return true;
            }

            // Search in articles
            return folder.articles.some(
                article =>
                    article.title?.toLowerCase().includes(lowerCaseQuery) ||
                    article.content?.toLowerCase().includes(lowerCaseQuery) ||
                    article.source?.toString().toLowerCase().includes(lowerCaseQuery) ||
                    article.author?.toLowerCase().includes(lowerCaseQuery)
            );
        });

        setFilteredFolders(filtered);
    }, [debouncedSearch, folders]);

    // Sort articles within folders
    useEffect(() => {
        const sortedFolders = filteredFolders.map(folder => {
            const sortedArticles = [...folder.articles].sort((a, b) => {
                const dateA = new Date(a.publish_date).getTime();
                const dateB = new Date(b.publish_date).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });

            return {
                ...folder,
                articles: sortedArticles
            };
        });

        setFilteredFolders(sortedFolders);
    }, [sortOrder]);

    // Handlers
    const handleArticleClick = (article: FolderArticle) => {
        setSelectedArticle(article);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
        // Delay clearing selected article to allow animation to complete
        setTimeout(() => {
            setSelectedArticle(null);
        }, 300);
    };

    const handleSaveArticle = async (article: FolderArticle) => {
        if (boards.length === 0) {
            showToast('warning', 'No Boards Available', 'Create a board first to save articles');
            return;
        }

        try {
            if (boards.length === 1) {
                // If there's only one board, save directly to it
                await addArticleToBoard(boards[0].id, {article_id: article.id});
                showToast('success', 'Article Saved', `Article saved to ${boards[0].name}`);
            } else {
                // Otherwise, open article detail with save dialog
                setSelectedArticle(article);
                setIsDetailOpen(true);
            }
        } catch (error) {
            showToast('error', 'Error', 'Failed to save article');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Loading state
    if (isLoading && folders.length === 0) {
        return <LoadingScreen/>;
    }

    // Error state
    if (error) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-exclamation-triangle"/>
                </EmptyStateIcon>
                <EmptyStateText>{error}</EmptyStateText>
                <Button onClick={fetchFoldersWithArticles}>Retry</Button>
            </EmptyState>
        );
    }

    // Check if we have any folders
    const hasFolders = filteredFolders.length > 0;

    // Selected article for Article view mode
    const firstArticle = hasFolders && filteredFolders[0].articles.length > 0
        ? filteredFolders[0].articles[0]
        : null;

    // Render
    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-home"/>
                    Home
                </PageTitle>

                <Actions>
                    <SearchWrapper>
                        <Input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon="search"
                        />
                    </SearchWrapper>
                    <Button leftIcon="sync" onClick={fetchFoldersWithArticles}>
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {hasFolders && (
                <>
                    <FilterBar>
                        <ViewSelector activeView={viewMode} onChange={setViewMode}/>

                        <FilterActions>
                            <SortSelect
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </SortSelect>
                        </FilterActions>
                    </FilterBar>

                    {/* Article View Mode */}
                    {viewMode === 'article' && firstArticle && (
                        <ArticleView
                            article={firstArticle}
                            onSaveArticle={handleSaveArticle}
                        />
                    )}

                    {/* Other View Modes */}
                    {viewMode !== 'article' && (
                        <ArticlesContainer view={viewMode}>
                            {filteredFolders.map(folder => (
                                <FolderArticlesSection
                                    key={`folder-${folder.id}`}
                                    id={`folder-${folder.id}`}
                                    folder={folder}
                                    onArticleClick={handleArticleClick}
                                    isInitiallyExpanded={filteredFolders.length <= 3}
                                />
                            ))}
                        </ArticlesContainer>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination>
                            <PageButton
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                aria-label="Previous page"
                            >
                                <i className="fas fa-chevron-left"/>
                            </PageButton>

                            {Array.from({length: totalPages}, (_, i) => (
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
                                <i className="fas fa-chevron-right"/>
                            </PageButton>
                        </Pagination>
                    )}
                </>
            )}

            {/* Empty state */}
            {!hasFolders && (
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-newspaper"/>
                    </EmptyStateIcon>
                    <EmptyStateText>
                        {debouncedSearch
                            ? 'No articles found. Try a different search query.'
                            : 'No articles available at the moment.'}
                    </EmptyStateText>
                    {!debouncedSearch && (
                        <Button leftIcon="plus" onClick={() => window.location.href = '/sources'}>
                            Add Sources
                        </Button>
                    )}
                </EmptyState>
            )}

            {/* Article Detail */}
            <EnhancedArticleDetail
                article={selectedArticle}
                isOpen={isDetailOpen}
                onClose={handleCloseDetail}
            />
        </PageContainer>
    );
};