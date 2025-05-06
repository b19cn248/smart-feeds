// src/components/features/article/ArticleGroupSection/ArticleGroupSection.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ArticleGroup, Article } from '../../../../types';
import { ArticleCard } from '../ArticleCard';
import { Button } from '../../../common/Button';

const GroupSection = styled.div`
    margin-bottom: 32px;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const GroupHeader = styled.div`
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

const SourceIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => theme.colors.primary.light};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    i {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const GroupTitle = styled.h2`
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

// Số bài viết hiển thị ban đầu
const INITIAL_ARTICLE_COUNT = 3;

interface ArticleGroupSectionProps {
    group: ArticleGroup;
    onArticleClick: (article: Article) => void;
    isInitiallyExpanded?: boolean;
    id: string;
}

export const ArticleGroupSection: React.FC<ArticleGroupSectionProps> = ({
                                                                            group,
                                                                            onArticleClick,
                                                                            isInitiallyExpanded = false,
                                                                            id
                                                                        }) => {
    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
    const [visibleArticles, setVisibleArticles] = useState(INITIAL_ARTICLE_COUNT);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState('1000px'); // Giá trị mặc định

    // Helper để lấy domain từ URL
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    // Cập nhật chiều cao khi mở rộng/thu gọn
    useEffect(() => {
        if (containerRef.current && isExpanded) {
            setContainerHeight(`${containerRef.current.scrollHeight}px`);
        }
    }, [isExpanded, visibleArticles]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const showMoreArticles = () => {
        setVisibleArticles(prev => prev + INITIAL_ARTICLE_COUNT);
    };

    const hasMoreArticles = visibleArticles < group.articles.length;
    const articlesToShow = group.articles.slice(0, visibleArticles);

    return (
        <GroupSection id={id}>
            <GroupHeader onClick={toggleExpand}>
                <TitleContainer>
                    <SourceIcon>
                        <i className="fas fa-rss" />
                    </SourceIcon>
                    <GroupTitle>{getDomain(group.source.url)}</GroupTitle>
                    <ArticleCount>{group.articles.length}</ArticleCount>
                </TitleContainer>
                <ToggleIcon isExpanded={isExpanded}>
                    <i className="fas fa-chevron-down" />
                </ToggleIcon>
            </GroupHeader>

            <ArticlesContainer
                isExpanded={isExpanded}
                maxHeight={containerHeight}
                ref={containerRef}
            >
                <ArticlesGrid>
                    {articlesToShow.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onClick={() => onArticleClick(article)}
                            lazyLoad={true}
                        />
                    ))}
                </ArticlesGrid>

                {hasMoreArticles && isExpanded && (
                    <ShowMoreButton>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                showMoreArticles();
                            }}
                            variant="secondary"
                        >
                            Show More ({group.articles.length - visibleArticles} remaining)
                        </Button>
                    </ShowMoreButton>
                )}
            </ArticlesContainer>
        </GroupSection>
    );
};