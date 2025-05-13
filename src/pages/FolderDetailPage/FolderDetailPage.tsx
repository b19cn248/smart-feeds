// src/pages/FolderDetailPage/FolderDetailPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FolderArticle, FolderDetailWithArticles } from '../../types/folderArticles.types';
import { folderArticlesService } from '../../services/folderArticlesService';
import { useToast } from '../../contexts/ToastContext';
import { useBoard } from '../../contexts/BoardContext';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ArticleCard } from '../../components/features/article/ArticleCard';
import { EnhancedArticleDetail } from '../../components/features/article/EnhancedArticleDetail';
import { ViewSelector, ViewMode } from '../../components/features/article/ViewSelector';
import { MagazineView, TitleOnlyView } from '../../components/features/article/ViewModes';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDebounce } from '../../hooks';

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

const SubTitle = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-top: 4px;
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        justify-content: space-between;
    }
`;

const SearchWrapper = styled.div`
    position: relative;
    width: 240px;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
    }
`;

const FilterBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
`;

const FilterActions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        justify-content: space-between;
    }
`;

const SortSelect = styled.select`
    padding: 8px 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 48px 0;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
    margin-top: 24px;
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

const ArticlesContainer = styled.div<{ view: ViewMode }>`
    flex: 1;
    background-color: ${({ view, theme }) =>
    view === 'title-only' ? theme.colors.background.secondary : 'transparent'};
    border-radius: ${({ view, theme }) =>
    view === 'title-only' ? theme.radii.lg : '0'};
    overflow: hidden;
`;

const ArticlesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    padding: 20px 0;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const LoadingIndicator = styled.div`
    text-align: center;
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

// Helper to get color from theme
const getColorFromTheme = (theme: string): string => {
    const themeToColorMap: Record<string, string> = {
        'blue': '#2E7CF6',
        'red': '#F43F5E',
        'green': '#10B981',
        'yellow': '#FBBF24',
        'purple': '#8B5CF6',
        'pink': '#EC4899',
        'default': '#64748B',
        'tech': '#2E7CF6',
        'sport': '#F43F5E',
        'news': '#10B981',
        'finance': '#FBBF24',
        'entertainment': '#8B5CF6',
        'health': '#EC4899',
    };

    return themeToColorMap[theme] || themeToColorMap.default;
};

export const FolderDetailPage: React.FC = () => {
    // Get folder ID from URL params
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();

    // State
    const [folderDetail, setFolderDetail] = useState<FolderDetailWithArticles | null>(null);
    const [articles, setArticles] = useState<FolderArticle[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<FolderArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useLocalStorage<ViewMode>('article-view-mode', 'magazine');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [selectedArticle, setSelectedArticle] = useState<FolderArticle | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Refs
    const observer = useRef<IntersectionObserver | null>(null);
    const lastArticleElementRef = useRef<HTMLDivElement | null>(null);

    // Hooks
    const debouncedSearch = useDebounce(searchQuery, 300);
    const { boards, addArticleToBoard } = useBoard();
    const { showToast } = useToast();

    // Fetch folder details with initial articles
    useEffect(() => {
        if (!folderId) return;

        const fetchFolderDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await folderArticlesService.getFolderDetailWithArticles(
                    parseInt(folderId),
                    0,         // page
                    10,        // size
                    'pubDate,DESC' // sort
                );

                setFolderDetail(response.data);
                setArticles(response.data.articles.content);
                setFilteredArticles(response.data.articles.content);
                setHasMore(!response.data.articles.last);
                setCurrentPage(0);
            } catch (error) {
                console.error('Error fetching folder details:', error);
                setError('Failed to load folder details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFolderDetail();
    }, [folderId]);

    // Setup intersection observer for infinite scroll
    const lastArticleRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreArticles();
            }
        }, { threshold: 0.5 });

        if (node) observer.current.observe(node);
        lastArticleElementRef.current = node;
    }, [isLoadingMore, hasMore]);

    // Load more articles when scrolling down
    const loadMoreArticles = async () => {
        if (!hasMore || isLoadingMore || !folderId) return;

        try {
            setIsLoadingMore(true);
            const nextPage = currentPage + 1;

            const response = await folderArticlesService.getFolderDetailWithArticles(
                parseInt(folderId),
                nextPage,
                10,
                'pubDate,DESC'
            );

            const newArticles = response.data.articles.content;

            setArticles(prev => [...prev, ...newArticles]);
            setCurrentPage(nextPage);
            setHasMore(!response.data.articles.last);
        } catch (error) {
            console.error('Error loading more articles:', error);
            showToast('error', 'Error', 'Failed to load more articles');
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Filter articles based on search query
    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setFilteredArticles(articles);
            return;
        }

        const lowerCaseQuery = debouncedSearch.toLowerCase();
        const filtered = articles.filter(article =>
            article.title?.toLowerCase().includes(lowerCaseQuery) ||
            article.content?.toLowerCase().includes(lowerCaseQuery) ||
            article.source?.toString().toLowerCase().includes(lowerCaseQuery) ||
            article.author?.toLowerCase().includes(lowerCaseQuery)
        );

        setFilteredArticles(filtered);
    }, [debouncedSearch, articles]);

    // Sort articles based on sort order
    useEffect(() => {
        const sortedArticles = [...filteredArticles].sort((a, b) => {
            const dateA = new Date(a.publish_date).getTime();
            const dateB = new Date(b.publish_date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredArticles(sortedArticles);
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

    const handleGoBack = () => {
        navigate(-1);
    };

    // Loading state
    if (isLoading && !folderDetail) {
        return <LoadingScreen />;
    }

    // Error state
    if (error) {
        return (
            <PageContainer>
                <PageHeader>
                    <Button onClick={handleGoBack} leftIcon="arrow-left" variant="secondary">
                        Go Back
                    </Button>
                </PageHeader>
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-exclamation-triangle" />
                    </EmptyStateIcon>
                    <EmptyStateText>{error}</EmptyStateText>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </EmptyState>
            </PageContainer>
        );
    }

    // Check if we have folder data
    if (!folderDetail) {
        return (
            <PageContainer>
                <PageHeader>
                    <Button onClick={handleGoBack} leftIcon="arrow-left" variant="secondary">
                        Go Back
                    </Button>
                </PageHeader>
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-folder-open" />
                    </EmptyStateIcon>
                    <EmptyStateText>Folder not found</EmptyStateText>
                    <Button onClick={handleGoBack}>Go Back</Button>
                </EmptyState>
            </PageContainer>
        );
    }

    // Folder exists but has no articles
    const hasArticles = filteredArticles.length > 0;

    return (
        <PageContainer>
            <PageHeader>
                <div>
                    <PageTitle>
                        <Button
                            onClick={handleGoBack}
                            leftIcon="arrow-left"
                            variant="secondary"
                            style={{ marginRight: '8px' }}
                        />
                        <i className="fas fa-folder" style={{ color: getColorFromTheme(folderDetail.theme) }} />
                        {folderDetail.name}
                    </PageTitle>
                    <SubTitle>{articles.length} articles</SubTitle>
                </div>

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
                    <Button leftIcon="sync" onClick={() => window.location.reload()}>
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {hasArticles && (
                <>
                    <FilterBar>
                        <ViewSelector activeView={viewMode} onChange={setViewMode} />

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

                    <ArticlesContainer view={viewMode}>
                        {viewMode === 'cards' && (
                            <ArticlesGrid>
                                {filteredArticles.map((article, index) => {
                                    if (index === filteredArticles.length - 1) {
                                        // Apply ref to last article for infinite scroll
                                        return (
                                            <div ref={lastArticleRef} key={article.id}>
                                                <ArticleCard
                                                    article={article}
                                                    onClick={() => handleArticleClick(article)}
                                                    lazyLoad={true}
                                                />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                                onClick={() => handleArticleClick(article)}
                                                lazyLoad={true}
                                            />
                                        );
                                    }
                                })}
                            </ArticlesGrid>
                        )}

                        {viewMode === 'magazine' && (
                            <>
                                <MagazineView
                                    articles={filteredArticles}
                                    onArticleClick={handleArticleClick}
                                    onSaveArticle={handleSaveArticle}
                                />
                                {/* The last item reference for infinite scroll */}
                                {hasMore && (
                                    <div ref={lastArticleRef} style={{ height: '10px', width: '100%' }}></div>
                                )}
                            </>
                        )}

                        {viewMode === 'title-only' && (
                            <>
                                <TitleOnlyView
                                    articles={filteredArticles}
                                    onArticleClick={handleArticleClick}
                                    onSaveArticle={handleSaveArticle}
                                />
                                {/* The last item reference for infinite scroll */}
                                {hasMore && (
                                    <div ref={lastArticleRef} style={{ height: '10px', width: '100%' }}></div>
                                )}
                            </>
                        )}

                        {isLoadingMore && (
                            <LoadingIndicator>
                                <i className="fas fa-circle-notch" />
                                Loading more articles...
                            </LoadingIndicator>
                        )}
                    </ArticlesContainer>
                </>
            )}

            {/* Empty state */}
            {!hasArticles && (
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-newspaper" />
                    </EmptyStateIcon>
                    <EmptyStateText>
                        {debouncedSearch
                            ? 'No articles found. Try a different search query.'
                            : 'No articles available in this folder.'}
                    </EmptyStateText>
                    <Button onClick={handleGoBack} leftIcon="arrow-left">
                        Go Back
                    </Button>
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