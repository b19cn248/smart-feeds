// src/components/features/article/ExploreCollectionsSection/ExploreCollectionsSection.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { ExploreCollection, exploreService } from '../../../../services/exploreService';
import { useToast } from '../../../../contexts/ToastContext';
import { Button } from '../../../common/Button';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { CardsView } from '../ViewModes';

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

const CollectionSelector = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 8px 0;
  margin-bottom: 16px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: 4px;
  }
`;

const CollectionCard = styled.button<{ isActive: boolean, imageUrl: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  height: 120px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px solid ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : 'transparent'};
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CollectionName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: white;
  text-align: center;
  margin-top: auto;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
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

interface ExploreCollectionsSectionProps {
    onArticleClick: (article: Article) => void;
    onSaveArticle?: (article: Article) => void;
}

export const ExploreCollectionsSection: React.FC<ExploreCollectionsSectionProps> = ({
                                                                                        onArticleClick,
                                                                                        onSaveArticle
                                                                                    }) => {
    const [collections, setCollections] = useState<ExploreCollection[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<ExploreCollection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await exploreService.getExploreCollections(0, 10);
            const collections = response.data.content;
            setCollections(collections);

            // Auto-select the first collection if any
            if (collections.length > 0 && !selectedCollection) {
                setSelectedCollection(collections[0]);
            }
        } catch (error) {
            console.error('Error fetching explore collections:', error);
            setError('Failed to load explore collections. Please try again.');
            showToast('error', 'Error', 'Failed to load explore collections.');
        } finally {
            setIsLoading(false);
        }
    };

    // Track view when an article is clicked
    const handleArticleClick = (article: Article) => {
        // Track view using the API
        fetch(`/top-stories/track/view/${article.id}`, { method: 'POST' })
            .catch(error => console.error('Error tracking article view:', error));

        onArticleClick(article);
    };

    const handleCollectionClick = (collection: ExploreCollection) => {
        setSelectedCollection(collection);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>
                        <i className="fas fa-compass" />
                        Explore Collections
                    </SectionTitle>
                    <Button leftIcon="sync" onClick={fetchCollections} size="sm">
                        Retry
                    </Button>
                </SectionHeader>
                <EmptyState>
                    <EmptyStateText>{error}</EmptyStateText>
                </EmptyState>
            </SectionContainer>
        );
    }

    if (collections.length === 0) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>
                        <i className="fas fa-compass" />
                        Explore Collections
                    </SectionTitle>
                </SectionHeader>
                <EmptyState>
                    <EmptyStateText>No collections available at the moment.</EmptyStateText>
                </EmptyState>
            </SectionContainer>
        );
    }

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>
                    <i className="fas fa-compass" />
                    Explore Collections
                </SectionTitle>
                <Button leftIcon="sync" onClick={fetchCollections} size="sm" variant="ghost">
                    Refresh
                </Button>
            </SectionHeader>

            <CollectionSelector>
                {collections.map(collection => (
                    <CollectionCard
                        key={collection.id}
                        isActive={selectedCollection?.id === collection.id}
                        imageUrl={collection.image_url}
                        onClick={() => handleCollectionClick(collection)}
                    >
                        <CollectionName>{collection.name}</CollectionName>
                    </CollectionCard>
                ))}
            </CollectionSelector>

            {selectedCollection && selectedCollection.articles.length > 0 ? (
                <CardsView
                    articles={selectedCollection.articles}
                    onArticleClick={handleArticleClick}
                    onSaveArticle={onSaveArticle}
                />
            ) : (
                <EmptyState>
                    <EmptyStateText>
                        {selectedCollection
                            ? 'No articles available in this collection.'
                            : 'Select a collection to view articles.'}
                    </EmptyStateText>
                </EmptyState>
            )}
        </SectionContainer>
    );
};