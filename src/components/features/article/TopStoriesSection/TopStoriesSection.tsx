// src/components/features/article/TopStoriesSection/TopStoriesSection.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { topStoriesService } from '../../../../services/topStoriesService';
import { useToast } from '../../../../contexts/ToastContext';
import { MagazineView } from '../ViewModes';
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

interface TopStoriesSectionProps {
    onArticleClick: (article: Article) => void;
    onSaveArticle?: (article: Article) => void;
}

export const TopStoriesSection: React.FC<TopStoriesSectionProps> = ({
                                                                        onArticleClick,
                                                                        onSaveArticle
                                                                    }) => {
    const [topStories, setTopStories] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchTopStories();
    }, []);

    const fetchTopStories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await topStoriesService.getTopStories(0, 5);
            setTopStories(response.data.content);
        } catch (error) {
            console.error('Error fetching top stories:', error);
            setError('Failed to load top stories. Please try again.');
            showToast('error', 'Error', 'Failed to load top stories.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>
                        <i className="fas fa-star" />
                        Top Stories
                    </SectionTitle>
                    <Button leftIcon="sync" onClick={fetchTopStories} size="sm">
                        Retry
                    </Button>
                </SectionHeader>
                <EmptyState>
                    <EmptyStateText>{error}</EmptyStateText>
                </EmptyState>
            </SectionContainer>
        );
    }

    if (topStories.length === 0) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>
                        <i className="fas fa-star" />
                        Top Stories
                    </SectionTitle>
                </SectionHeader>
                <EmptyState>
                    <EmptyStateText>No top stories available at the moment.</EmptyStateText>
                </EmptyState>
            </SectionContainer>
        );
    }

    // Track view when an article is clicked
    const handleArticleClick = (article: Article) => {
        topStoriesService.trackArticleView(article.id)
            .catch(error => console.error('Error tracking article view:', error));
        onArticleClick(article);
    };

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>
                    <i className="fas fa-star" />
                    Top Stories
                </SectionTitle>
                <Button leftIcon="sync" onClick={fetchTopStories} size="sm" variant="ghost">
                    Refresh
                </Button>
            </SectionHeader>
            <MagazineView
                articles={topStories}
                onArticleClick={handleArticleClick}
                onSaveArticle={onSaveArticle}
            />
        </SectionContainer>
    );
};