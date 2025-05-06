// src/pages/ArticlesPage/ArticlesPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article, ArticleGroup } from '../../types';
import { articleService } from '../../services/articleService';
import { ArticleGroupSection } from '../../components/features/article/ArticleGroupSection';
import { ArticleDetail } from '../../components/features/article/ArticleDetail';
import { SourceNavigator } from '../../components/features/article/SourceNavigator';
import { Input } from '../../components/common/Input';
import { useDebounce } from '../../hooks';
import { Button } from '../../components/common/Button';
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

const EmptyState = styled.div`
    text-align: center;
    padding: 48px 0;
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

// Thêm component cho tính năng "Expand All" / "Collapse All"
const ExpandCollapseControl = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
`;

export const ArticlesPage: React.FC = () => {
    // Thay đổi state để lưu trữ nhóm articles thay vì danh sách articles phẳng
    const [articleGroups, setArticleGroups] = useState<ArticleGroup[]>([]);
    const [filteredArticleGroups, setFilteredArticleGroups] = useState<ArticleGroup[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // State mới
    const [allExpanded, setAllExpanded] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);

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

    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setFilteredArticleGroups(articleGroups);
            return;
        }

        const lowerCaseQuery = debouncedSearch.toLowerCase();
        // Lọc theo nhóm và articles trong nhóm
        const filtered = articleGroups.map(group => {
            const filteredArticles = group.articles.filter(
                article =>
                    article.title?.toLowerCase().includes(lowerCaseQuery) ||
                    article.content?.toLowerCase().includes(lowerCaseQuery) ||
                    article.source?.toLowerCase().includes(lowerCaseQuery) ||
                    article.author?.toLowerCase().includes(lowerCaseQuery)
            );

            // Trả về nhóm mới với article đã lọc
            return {
                ...group,
                articles: filteredArticles
            };
        }).filter(group => group.articles.length > 0); // Chỉ giữ các nhóm có article

        setFilteredArticleGroups(filtered);
    }, [debouncedSearch, articleGroups]);

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

    // Hàm mới để scroll đến một nguồn cụ thể
    const scrollToSource = (sourceId: number) => {
        const elementId = `source-${sourceId}`;
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Hàm xử lý expand/collapse tất cả
    const toggleAllExpanded = () => {
        setAllExpanded(!allExpanded);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

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

    // Kiểm tra xem có bất kỳ nhóm nào có ít nhất một bài viết không
    const hasArticles = filteredArticleGroups.some(group => group.articles.length > 0);

    return (
        <>
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

            {/* Thêm thanh điều hướng nguồn */}
            {hasArticles && (
                <SourceNavigator
                    groups={filteredArticleGroups}
                    onSourceClick={scrollToSource}
                />
            )}

            {/* Thêm điều khiển expand/collapse tất cả */}
            {hasArticles && filteredArticleGroups.length > 1 && (
                <ExpandCollapseControl>
                    <Button
                        variant="ghost"
                        onClick={toggleAllExpanded}
                        leftIcon={allExpanded ? "compress-alt" : "expand-alt"}
                    >
                        {allExpanded ? "Collapse All" : "Expand All"}
                    </Button>
                </ExpandCollapseControl>
            )}

            {hasArticles ? (
                // Hiển thị các nhóm articles
                <>
                    {filteredArticleGroups.map((group) => (
                        // Chỉ hiển thị nhóm nếu có ít nhất một bài viết
                        group.articles.length > 0 && (
                            <ArticleGroupSection
                                key={`source-${group.source.id}`}
                                id={`source-${group.source.id}`}
                                group={group}
                                onArticleClick={handleArticleClick}
                                isInitiallyExpanded={allExpanded || filteredArticleGroups.length === 1}
                            />
                        )
                    ))}
                </>
            ) : (
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

            <ArticleDetail
                article={selectedArticle}
                isOpen={isDetailOpen}
                onClose={handleCloseDetail}
            />
        </>
    );
};