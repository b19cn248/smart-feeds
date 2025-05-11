// src/components/features/article/ViewModes/CardsView.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate, truncateText } from '../../../../utils';

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 16px;
`;

const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.default};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  height: 100%;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  }
`;

const CardImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 160px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CardExcerpt = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 16px 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  @media (prefers-color-scheme: dark) {
    border-top-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const SourceDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
  
  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[700]};
    }
  }
`;

// Extract text from HTML content
const extractTextFromHtml = (html: string): string => {
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    } catch (error) {
        console.error('Error parsing HTML content:', error);
        return html;
    }
};

interface CardsViewProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
    onSaveArticle?: (article: Article) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({
                                                        articles,
                                                        onArticleClick,
                                                        onSaveArticle
                                                    }) => {
    return (
        <CardsGrid>
            {articles.map(article => {
                const excerptText = truncateText(extractTextFromHtml(article.content), 120);

                return (
                    <CardItem key={article.id} onClick={() => onArticleClick(article)}>
                        {article.image_url && (
                            <CardImage imageUrl={article.image_url || DEFAULT_ARTICLE_IMAGE} />
                        )}
                        <CardContent>
                            <CardTitle>{article.title}</CardTitle>
                            <CardExcerpt>{excerptText}</CardExcerpt>
                            <CardFooter>
                                <SourceDate>
                                    <span>{typeof article.source === 'string' ? article.source : 'Unknown source'}</span>
                                    <span>{formatDate(new Date(article.publish_date))}</span>
                                </SourceDate>
                                <CardActions>
                                    {onSaveArticle && (
                                        <ActionButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSaveArticle(article);
                                            }}
                                            title="Save to board"
                                        >
                                            <i className="fas fa-bookmark" />
                                        </ActionButton>
                                    )}
                                </CardActions>
                            </CardFooter>
                        </CardContent>
                    </CardItem>
                );
            })}
        </CardsGrid>
    );
};