// src/pages/ArticlesPage/ArticlesPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article } from '../../types';
import { getArticles } from '../../utils/mockData';
import { ArticleCard } from '../../components/features/article/ArticleCard';
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

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
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
`;

export const ArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const data = await getArticles();
                setArticles(data);
                setFilteredArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setFilteredArticles(articles);
            return;
        }

        const lowerCaseQuery = debouncedSearch.toLowerCase();
        const filtered = articles.filter(
            article =>
                article.title.toLowerCase().includes(lowerCaseQuery) ||
                article.content.toLowerCase().includes(lowerCaseQuery) ||
                article.source.toLowerCase().includes(lowerCaseQuery) ||
                article.author.toLowerCase().includes(lowerCaseQuery)
        );

        setFilteredArticles(filtered);
    }, [debouncedSearch, articles]);

    const handleArticleClick = (article: Article) => {
        // Navigate to article detail or open in new tab
        window.open(article.url, '_blank');
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

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

                    <Button leftIcon="sync">
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {filteredArticles.length > 0 ? (
                <ArticlesGrid>
                    {filteredArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onClick={() => handleArticleClick(article)}
                        />
                    ))}
                </ArticlesGrid>
            ) : (
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-newspaper" />
                    </EmptyStateIcon>
                    <EmptyStateText>No articles found. Try a different search query.</EmptyStateText>
                </EmptyState>
            )}
        </>
    );
};