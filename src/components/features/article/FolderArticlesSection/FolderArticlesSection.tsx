// src/components/features/article/FolderArticlesSection/FolderArticlesSection.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FolderWithArticles, FolderArticle, FolderDetailWithArticles } from '../../../../types/folderArticles.types';
import { ArticleCard } from '../ArticleCard';
import { Button } from '../../../common/Button';
import { formatDate } from '../../../../utils';
import { folderArticlesService } from '../../../../services/folderArticlesService';
import { useToast } from '../../../../contexts/ToastContext';

const SectionContainer = styled.div`
    margin-bottom: 32px;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    @media (prefers-color-scheme: dark) {
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
`;

const FolderIcon = styled.div<{ color: string }>`
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${props => `${props.color}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    i {
        font-size: 16px;
        color: ${props => props.color};
    }
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
`;

const ArticleCount = styled.span`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    background-color: ${({ theme }) => theme.colors.gray[100]};
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: 8px;

    @media (prefers-color-scheme: dark) {
        background-color: ${({ theme }) => theme.colors.gray[800]};
    }
`;

const ToggleIcon = styled.div<{ isExpanded: boolean }>`
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: transform 0.3s;
    transform: ${({ isExpanded }) => isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ArticlesContainer = styled.div<{ isExpanded: boolean, maxHeight: string }>`
    max-height: ${({ isExpanded, maxHeight }) => isExpanded ? maxHeight : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
`;

const ArticlesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    padding: 20px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const ShowMoreButton = styled.div`
    display: flex;
    justify-content: center;
    padding: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    
    @media (prefers-color-scheme: dark) {
        border-top-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const LoadingIndicator = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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

interface FolderArticlesSectionProps {
    folder: FolderWithArticles;
    onArticleClick: (article: FolderArticle) => void;
    isInitiallyExpanded?: boolean;
    id: string;
}

export const FolderArticlesSection: React.FC<FolderArticlesSectionProps> = ({
                                                                                folder,
                                                                                onArticleClick,
                                                                                isInitiallyExpanded = false,
                                                                                id
                                                                            }) => {
    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
    const [articles, setArticles] = useState<FolderArticle[]>(folder.articles);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalArticles, setTotalArticles] = useState(folder.articles.length);
    const [hasMore, setHasMore] = useState(true);
    const [containerHeight, setContainerHeight] = useState('1000px');
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    // Update height when expanded/collapsed
    useEffect(() => {
        if (containerRef.current && isExpanded) {
            setContainerHeight(`${containerRef.current.scrollHeight}px`);
        }
    }, [isExpanded, articles]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Phần loadMoreArticles cần được cập nhật như sau
    const loadMoreArticles = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const nextPage = currentPage + 1;
            // Cập nhật gọi API theo đúng tài liệu
            const response = await folderArticlesService.getFolderDetailWithArticles(
                folder.id,
                nextPage,  // page
                9,         // size
                'pubDate,DESC' // sort
            );
            const folderDetail: FolderDetailWithArticles = response.data;

            // Append new articles to existing ones
            setArticles(prevArticles => [...prevArticles, ...folderDetail.articles.content]);
            setCurrentPage(nextPage);
            setTotalArticles(folderDetail.articles.total_elements);
            setHasMore(!folderDetail.articles.last);
        } catch (error) {
            console.error('Error loading more articles:', error);
            showToast('error', 'Error', 'Failed to load more articles');
        } finally {
            setIsLoading(false);
        }
    };

    const color = getColorFromTheme(folder.theme);

    return (
        <SectionContainer id={id}>
            <SectionHeader onClick={toggleExpand}>
                <TitleContainer>
                    <FolderIcon color={color}>
                        <i className="fas fa-folder" />
                    </FolderIcon>
                    <SectionTitle>{folder.name}</SectionTitle>
                    <ArticleCount>{totalArticles}</ArticleCount>
                </TitleContainer>
                <ToggleIcon isExpanded={isExpanded}>
                    <i className="fas fa-chevron-down" />
                </ToggleIcon>
            </SectionHeader>

            <ArticlesContainer
                isExpanded={isExpanded}
                maxHeight={containerHeight}
                ref={containerRef}
            >
                <ArticlesGrid>
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onClick={() => onArticleClick(article)}
                            lazyLoad={true}
                        />
                    ))}
                </ArticlesGrid>

                {isLoading && (
                    <LoadingIndicator>
                        <i className="fas fa-circle-notch" />
                        Loading more articles...
                    </LoadingIndicator>
                )}

                {!isLoading && hasMore && isExpanded && (
                    <ShowMoreButton>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                loadMoreArticles();
                            }}
                            variant="secondary"
                        >
                            Show More ({totalArticles - articles.length} remaining)
                        </Button>
                    </ShowMoreButton>
                )}
            </ArticlesContainer>
        </SectionContainer>
    );
};