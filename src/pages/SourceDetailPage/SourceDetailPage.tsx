// src/pages/SourceDetailPage/SourceDetailPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { sourceService } from '../../services/sourceService';
import { MagazineView } from '../../components/features/article/ViewModes';
import { EnhancedArticleDetail } from '../../components/features/article/EnhancedArticleDetail';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useToast } from '../../contexts/ToastContext';
import { useBoard } from '../../contexts/BoardContext';
import { useCategories } from '../../hooks'; // Thêm import
import { Source, Article } from '../../types';
import { useDebounce } from '../../hooks';
import { SourceToFolderModal } from '../../components/features/source/SourceToFolderModal';

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

const SourceInfo = styled.div`
    margin-bottom: 24px;
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SourceHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
`;

const SourceMeta = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 8px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
    }
`;

const SourceStatus = styled.div<{ active: boolean }>`
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 12px;
    background-color: ${({ active, theme }) =>
    active ? `${theme.colors.success}20` : `${theme.colors.error}20`};
    color: ${({ active, theme }) =>
    active ? theme.colors.success : theme.colors.error};

    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

// Thêm styled components cho categories
const CategoriesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
`;

const CategoryTag = styled.div`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    background-color: ${({ theme }) => `${theme.colors.primary.main}15`};
    color: ${({ theme }) => theme.colors.primary.main};
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    border: 1px solid ${({ theme }) => `${theme.colors.primary.main}30`};

    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
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

export const SourceDetailPage: React.FC = () => {
    // Get sourceId from URL params
    const { sourceId } = useParams<{ sourceId: string }>();
    const navigate = useNavigate();

    // State
    const [source, setSource] = useState<Source | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // State cho modal Add to Folder
    const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);

    // Refs for infinite scroll
    const observer = useRef<IntersectionObserver | null>(null);
    const lastArticleElementRef = useRef<HTMLDivElement | null>(null);

    // Hooks
    const debouncedSearch = useDebounce(searchQuery, 300);
    const { boards, addArticleToBoard } = useBoard();
    const { categories } = useCategories(); // Thêm hook để lấy categories
    const { showToast } = useToast();

    // Helper để lấy tên categories từ IDs
    const getCategoryNames = useCallback((categoryIds: number[]): string[] => {
        if (!categoryIds || !Array.isArray(categoryIds)) {
            return [];
        }

        return categoryIds
            .map(id => {
                const category = categories.find(cat => cat.id === id);
                return category ? category.name : null;
            })
            .filter((name): name is string => name !== null);
    }, [categories]);

    // Fetch source details and articles - Cập nhật để sử dụng API mới
    useEffect(() => {
        if (!sourceId) return;

        const fetchSourceDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Sử dụng API mới để lấy source details và articles
                const [sourceResponse, articlesResponse] = await Promise.all([
                    sourceService.getSourceById(parseInt(sourceId)),
                    sourceService.getSourceArticles(parseInt(sourceId))
                ]);

                // Xử lý source data
                if (sourceResponse.data) {
                    setSource(sourceResponse.data);
                } else {
                    throw new Error('Source not found');
                }

                // Xử lý articles data
                const sortedArticles = [...articlesResponse.data.articles].sort((a, b) => {
                    const dateA = new Date(a.publish_date).getTime();
                    const dateB = new Date(b.publish_date).getTime();
                    return dateB - dateA; // Default: newest first
                });

                setArticles(sortedArticles);
                setFilteredArticles(sortedArticles);
            } catch (error) {
                console.error('Error fetching source details:', error);
                setError('Failed to load source details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSourceDetails();
    }, [sourceId]);

    // Setup intersection observer for infinite scroll
    const lastArticleRef = useCallback((node: HTMLDivElement) => {
        if (isLoadingMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                // Nơi để gọi API load thêm bài viết nếu cần thiết
                // Hiện tại API chưa hỗ trợ phân trang nên tạm thời không triển khai

                // Khi API hỗ trợ phân trang, có thể thêm code sau:
                // loadMoreArticles();
            }
        }, { threshold: 0.5 });

        if (node) observer.current.observe(node);
        lastArticleElementRef.current = node;
    }, [isLoadingMore]);

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

    // Handler cho nút Add to Folder
    const handleAddToFolderClick = () => {
        setShowAddToFolderModal(true);
    };

    // Helper to extract domain from URL
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    // Loading state
    if (isLoading) {
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

    // No source found
    if (!source) {
        return (
            <PageContainer>
                <PageHeader>
                    <Button onClick={handleGoBack} leftIcon="arrow-left" variant="secondary">
                        Go Back
                    </Button>
                </PageHeader>
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-rss" />
                    </EmptyStateIcon>
                    <EmptyStateText>Source not found</EmptyStateText>
                    <Button onClick={handleGoBack}>Go Back</Button>
                </EmptyState>
            </PageContainer>
        );
    }

    // Source exists but has no articles
    const hasArticles = filteredArticles.length > 0;

    // Lấy danh sách categories của source
    const sourceCategories = getCategoryNames(source.categories_ids || []);

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
                        <i className="fas fa-rss" />
                        Source Details
                    </PageTitle>
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

            <SourceInfo>
                <SourceHeader>
                    <h2>{source.name}</h2>
                    <Button
                        variant="secondary"
                        leftIcon="folder-plus"
                        onClick={handleAddToFolderClick}
                    >
                        Add to Folder
                    </Button>
                </SourceHeader>

                <SourceMeta>
                    <MetaItem>
                        <i className="fas fa-link" />
                        {getDomain(source.url)}
                    </MetaItem>
                    <MetaItem>
                        <i className="fas fa-tag" />
                        {source.type}
                    </MetaItem>
                    <SourceStatus active={source.active}>
                        <i className={`fas fa-${source.active ? 'circle-check' : 'circle-xmark'}`} />
                        {source.active ? 'Active' : 'Inactive'}
                    </SourceStatus>
                </SourceMeta>

                {/* Hiển thị categories nếu có */}
                {sourceCategories.length > 0 && (
                    <CategoriesContainer>
                        {sourceCategories.map((categoryName, index) => (
                            <CategoryTag key={index} title={categoryName}>
                                <i className="fas fa-folder" />
                                {categoryName}
                            </CategoryTag>
                        ))}
                    </CategoriesContainer>
                )}
            </SourceInfo>

            {hasArticles ? (
                <>
                    <FilterBar>
                        <h3>Articles</h3>
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

                    <MagazineView
                        articles={filteredArticles}
                        onArticleClick={handleArticleClick}
                        onSaveArticle={handleSaveArticle}
                    />

                    {/* Reference element for infinite scroll */}
                    <div ref={lastArticleRef} style={{ height: '10px', width: '100%' }}></div>

                    {isLoadingMore && (
                        <LoadingIndicator>
                            <i className="fas fa-circle-notch" />
                            Loading more articles...
                        </LoadingIndicator>
                    )}
                </>
            ) : (
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-newspaper" />
                    </EmptyStateIcon>
                    <EmptyStateText>
                        {debouncedSearch
                            ? 'No articles found. Try a different search query.'
                            : 'No articles available for this source.'}
                    </EmptyStateText>
                </EmptyState>
            )}

            {/* Article Detail */}
            <EnhancedArticleDetail
                article={selectedArticle}
                isOpen={isDetailOpen}
                onClose={handleCloseDetail}
                teamBoardId=""
            />

            {/* Add to Folder Modal */}
            <SourceToFolderModal
                isOpen={showAddToFolderModal}
                onClose={() => setShowAddToFolderModal(false)}
                source={source}
            />
        </PageContainer>
    );
};