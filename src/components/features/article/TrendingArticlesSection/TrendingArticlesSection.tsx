// src/components/features/article/TrendingArticlesSection/TrendingArticlesSection.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { topStoriesService, TrendingTopic } from '../../../../services/topStoriesService';
import { useToast } from '../../../../contexts/ToastContext';
import { CardsView } from '../ViewModes';
import { Button } from '../../../common/Button';
import { LoadingScreen } from '../../../common/LoadingScreen';

const SectionContainer = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const TopicsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 8px 4px;
  }
`;

const TopicChip = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.gray[100]};
  color: ${({ isActive, theme }) =>
    isActive ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.hover : theme.colors.gray[200]};
  }
  
  span {
    margin-left: 4px;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ isActive, theme }) =>
    isActive ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

interface TrendingArticlesSectionProps {
    onArticleClick: (article: Article) => void;
    onSaveArticle?: (article: Article) => void;
}

export const TrendingArticlesSection: React.FC<TrendingArticlesSectionProps> = ({
                                                                                    onArticleClick,
                                                                                    onSaveArticle
                                                                                }) => {
    const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
    const [isLoadingArticles, setIsLoadingArticles] = useState(true);
    const [isLoadingTopics, setIsLoadingTopics] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchTrendingTopics();
        fetchTrendingArticles();
    }, []);

    useEffect(() => {
        if (selectedTopic) {
            fetchArticlesByCategory(selectedTopic.category_id);
        } else {
            fetchTrendingArticles();
        }
    }, [selectedTopic]);

    const fetchTrendingTopics = async () => {
        try {
            setIsLoadingTopics(true);
            const response = await topStoriesService.getTrendingTopics(0, 10);
            setTrendingTopics(response.data.content);
        } catch (error) {
            console.error('Error fetching trending topics:', error);
            showToast('error', 'Error', 'Failed to load trending topics.');
        } finally {
            setIsLoadingTopics(false);
        }
    };

    const fetchTrendingArticles = async () => {
        try {
            setIsLoadingArticles(true);
            setError(null);
            const response = await topStoriesService.getTrendingArticles(0, 6);
            setTrendingArticles(response.data.content);
        } catch (error) {
            console.error('Error fetching trending articles:', error);
            setError('Failed to load trending articles. Please try again.');
            showToast('error', 'Error', 'Failed to load trending articles.');
        } finally {
            setIsLoadingArticles(false);
        }
    };

    const fetchArticlesByCategory = async (categoryId: number) => {
        try {
            setIsLoadingArticles(true);
            setError(null);
            const response = await topStoriesService.getTrendingArticlesByCategory(categoryId, 0, 6);
            setTrendingArticles(response.data.content);
        } catch (error) {
            console.error('Error fetching category articles:', error);
            setError('Failed to load articles for this category. Please try again.');
            showToast('error', 'Error', 'Failed to load category articles.');
        } finally {
            setIsLoadingArticles(false);
        }
    };

    // Track view when an article is clicked
    const handleArticleClick = (article: Article) => {
        topStoriesService.trackArticleView(article.id)
            .catch(error => console.error('Error tracking article view:', error));
        onArticleClick(article);
    };

    const handleTopicClick = (topic: TrendingTopic) => {
        if (selectedTopic && selectedTopic.id === topic.id) {
            setSelectedTopic(null);
        } else {
            setSelectedTopic(topic);
        }
    };

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>
                    <i className="fas fa-chart-line" />
                    Trending Now
                </SectionTitle>
                <Button
                    leftIcon="sync"
                    onClick={selectedTopic ? () => fetchArticlesByCategory(selectedTopic.category_id) : fetchTrendingArticles}
                    size="sm"
                    variant="ghost"
                >
                    Refresh
                </Button>
            </SectionHeader>

            {!isLoadingTopics && trendingTopics.length > 0 && (
                <TopicsContainer>
                    {trendingTopics.map(topic => (
                        <TopicChip
                            key={topic.id}
                            isActive={selectedTopic?.id === topic.id}
                            onClick={() => handleTopicClick(topic)}
                        >
                            {topic.topic_name}
                            <span>{Math.round(topic.score)}</span>
                        </TopicChip>
                    ))}
                </TopicsContainer>
            )}

            {isLoadingArticles ? (
                <LoadingScreen />
            ) : error ? (
                <EmptyState>
                    <EmptyStateText>{error}</EmptyStateText>
                </EmptyState>
            ) : trendingArticles.length === 0 ? (
                <EmptyState>
                    <EmptyStateText>No trending articles available at the moment.</EmptyStateText>
                </EmptyState>
            ) : (
                <CardsView
                    articles={trendingArticles}
                    onArticleClick={handleArticleClick}
                    onSaveArticle={onSaveArticle}
                />
            )}
        </SectionContainer>
    );
};