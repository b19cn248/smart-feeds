// src/pages/ArticlesPage/ArticlesPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article, ArticleGroup } from '../../types';
import { articleService } from '../../services/articleService';
import { SourceNavigator } from '../../components/features/article/SourceNavigator';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useDebounce } from '../../hooks';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ViewSelector, ViewMode } from '../../components/features/article/ViewSelector';
import { TitleOnlyView, MagazineView, CardsView, ArticleView } from '../../components/features/article/ViewModes';
import { EnhancedArticleDetail } from '../../components/features/article/EnhancedArticleDetail';
import { useBoard } from '../../contexts/BoardContext';
import { useToast } from '../../contexts/ToastContext';

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
 
 @media (prefers-color-scheme: dark) {
   background-color: ${({ theme }) => theme.colors.gray[800]};
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
 
 @media (prefers-color-scheme: dark) {
   background-color: ${({ theme }) => theme.colors.gray[800]};
   border-color: ${({ theme }) => theme.colors.gray[600]};
 }
`;

const EmptyState = styled.div`
 text-align: center;
 padding: 48px 0;
 background-color: ${({ theme }) => theme.colors.background.secondary};
 border-radius: ${({ theme }) => theme.radii.lg};
 border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
 margin-top: 24px;
 
 @media (prefers-color-scheme: dark) {
   background-color: ${({ theme }) => theme.colors.gray[800]};
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

const ArticlesContainer = styled.div<{ view: ViewMode }>`
 flex: 1;
 background-color: ${({ view, theme }) =>
    view === 'title-only' ? theme.colors.background.secondary : 'transparent'};
 border-radius: ${({ view, theme }) =>
    view === 'title-only' ? theme.radii.lg : '0'};
 overflow: hidden;
 
 @media (prefers-color-scheme: dark) {
   background-color: ${({ view, theme }) =>
    view === 'title-only' ? theme.colors.gray[800] : 'transparent'};
 }
`;

const GroupContainer = styled.div`
 margin-bottom: 32px;
`;

const GroupHeader = styled.div`
 display: flex;
 align-items: center;
 padding: 16px;
 margin-bottom: ${({ theme }) => theme.spacing.md};
 background-color: ${({ theme }) => theme.colors.background.secondary};
 border-radius: ${({ theme }) => theme.radii.lg};
 
 @media (prefers-color-scheme: dark) {
   background-color: ${({ theme }) => theme.colors.gray[800]};
 }
`;

const GroupIcon = styled.div`
 width: 36px;
 height: 36px;
 border-radius: ${({ theme }) => theme.radii.md};
 background-color: ${({ theme }) => theme.colors.primary.light};
 display: flex;
 align-items: center;
 justify-content: center;
 margin-right: 12px;
 
 i {
   color: ${({ theme }) => theme.colors.primary.main};
   font-size: 18px;
 }
`;

const GroupTitle = styled.h2`
 font-size: ${({ theme }) => theme.typography.fontSize.xl};
 font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
 color: ${({ theme }) => theme.colors.text.primary};
 margin: 0;
 flex: 1;
`;

const ArticleCount = styled.span`
 font-size: ${({ theme }) => theme.typography.fontSize.sm};
 color: ${({ theme }) => theme.colors.text.secondary};
 background-color: ${({ theme }) => theme.colors.gray[100]};
 padding: 4px 8px;
 border-radius: 12px;
 margin-left: 8px;
 
 @media (prefers-color-scheme: dark) {
   background-color: ${({ theme }) => theme.colors.gray[700]};
 }
`;

// Helper function to get domain from URL
const getDomain = (url: string): string => {
    try {
        const domain = new URL(url).hostname;
        return domain.startsWith('www.') ? domain.substring(4) : domain;
    } catch (error) {
        return url;
    }
};

export const ArticlesPage: React.FC = () => {
    // State
    const [articleGroups, setArticleGroups] = useState<ArticleGroup[]>([]);
    const [filteredArticleGroups, setFilteredArticleGroups] = useState<ArticleGroup[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [viewMode, setViewMode] = useLocalStorage<ViewMode>('article-view-mode', 'magazine');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Hooks
    const debouncedSearch = useDebounce(searchQuery, 300);
    const { boards, addArticleToBoard } = useBoard();
    const { showToast } = useToast();

    // Fetch articles
    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await articleService.getArticles();
            setArticleGroups(response.data.content);
            setFilteredArticleGroups(response.data.content);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('Failed to load articles. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter articles based on search query
    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setFilteredArticleGroups(articleGroups);
            return;
        }

        const lowerCaseQuery = debouncedSearch.toLowerCase();
        const filtered = articleGroups.map(group => {
            const filteredArticles = group.articles.filter(
                article =>
                    article.title?.toLowerCase().includes(lowerCaseQuery) ||
                    article.content?.toLowerCase().includes(lowerCaseQuery) ||
                    article.source?.toString().toLowerCase().includes(lowerCaseQuery) ||
                    article.author?.toLowerCase().includes(lowerCaseQuery)
            );

            return {
                ...group,
                articles: filteredArticles
            };
        }).filter(group => group.articles.length > 0);

        setFilteredArticleGroups(filtered);
    }, [debouncedSearch, articleGroups]);

    // Sort articles
    useEffect(() => {
        const sortedGroups = filteredArticleGroups.map(group => {
            const sortedArticles = [...group.articles].sort((a, b) => {
                const dateA = new Date(a.publish_date).getTime();
                const dateB = new Date(b.publish_date).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });

            return {
                ...group,
                articles: sortedArticles
            };
        });

        setFilteredArticleGroups(sortedGroups);
    }, [sortOrder]);

    // Handlers
    const handleArticleClick = (article: Article) => {
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

    const handleSaveArticle = async (article: Article) => {
        if (boards.length === 0) {
            showToast('warning', 'No Boards Available', 'Create a board first to save articles');
            return;
        }

        try {
            if (boards.length === 1) {
                // If there's only one board, save directly to it
                await addArticleToBoard(boards[0].id, { article_id: article.id });
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

    // Scroll to source
    const scrollToSource = (sourceId: number) => {
        const elementId = `source-${sourceId}`;
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Loading state
    if (isLoading) {
        return <LoadingScreen />;
    }

    // Error state
    if (error) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-exclamation-triangle" />
                </EmptyStateIcon>
                <EmptyStateText>{error}</EmptyStateText>
                <Button onClick={fetchArticles}>Retry</Button>
            </EmptyState>
        );
    }

    // Check if we have any articles
    const hasArticles = filteredArticleGroups.some(group => group.articles.length > 0);

    // Selected article for Article view mode
    const firstArticle = hasArticles ? filteredArticleGroups[0].articles[0] : null;

    // Render
    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-home" />
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

                    <Button leftIcon="sync" onClick={fetchArticles}>
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

                    {/* Source Navigator for quick navigation */}
                    {filteredArticleGroups.length > 1 && (
                        <SourceNavigator
                            groups={filteredArticleGroups}
                            onSourceClick={scrollToSource}
                        />
                    )}

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
                            {filteredArticleGroups.map(group => (
                                <GroupContainer key={`source-${group.source.id}`} id={`source-${group.source.id}`}>
                                    <GroupHeader>
                                        <GroupIcon>
                                            <i className="fas fa-rss" />
                                        </GroupIcon>
                                        <GroupTitle>{getDomain(group.source.url)}</GroupTitle>
                                        <ArticleCount>{group.articles.length}</ArticleCount>
                                    </GroupHeader>

                                    {/* Render appropriate view based on viewMode */}
                                    {viewMode === 'title-only' && (
                                        <TitleOnlyView
                                            articles={group.articles}
                                            onArticleClick={handleArticleClick}
                                            onSaveArticle={handleSaveArticle}
                                        />
                                    )}

                                    {viewMode === 'magazine' && (
                                        <MagazineView
                                            articles={group.articles}
                                            onArticleClick={handleArticleClick}
                                            onSaveArticle={handleSaveArticle}
                                        />
                                    )}

                                    {viewMode === 'cards' && (
                                        <CardsView
                                            articles={group.articles}
                                            onArticleClick={handleArticleClick}
                                            onSaveArticle={handleSaveArticle}
                                        />
                                    )}
                                </GroupContainer>
                            ))}
                        </ArticlesContainer>
                    )}
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