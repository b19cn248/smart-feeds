// src/components/features/teamBoard/ArticleCard/ArticleCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const SourceBadge = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const CardSnippet = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PublishDate = styled.div`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 6px;
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &.delete:hover {
    color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => `${theme.colors.error}10`};
  }
`;

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

interface TeamBoardArticleCardProps {
    article: Article;
    onRemove: (articleId: number) => void;
    onView: (article: Article) => void;
}

export const TeamBoardArticleCard: React.FC<TeamBoardArticleCardProps> = ({
                                                                              article,
                                                                              onRemove,
                                                                              onView
                                                                          }) => {
    // Xử lý domain từ URL
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(article.id);
    };

    const handleView = () => {
        onView(article);
    };

    return (
        <CardContainer onClick={handleView}>
            <ImageContainer>
                <ArticleImage
                    src={article.image_url || DEFAULT_IMAGE}
                    alt={article.title}
                    onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                />
                <SourceBadge>
                    {getDomain(article.source.toString())}
                </SourceBadge>
            </ImageContainer>

            <CardContent>
                <CardTitle>{article.title}</CardTitle>
                <CardSnippet>{article.content_snippet || article.summary || ''}</CardSnippet>

                <CardFooter>
                    <PublishDate>
                        <i className="fas fa-calendar" />
                        {formatDate(new Date(article.publish_date))}
                    </PublishDate>

                    <Actions>
                        <ActionButton
                            title="Open original article"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(article.url, '_blank');
                            }}
                        >
                            <i className="fas fa-external-link-alt" />
                        </ActionButton>

                        <ActionButton
                            className="delete"
                            title="Remove from board"
                            onClick={handleRemove}
                        >
                            <i className="fas fa-times" />
                        </ActionButton>
                    </Actions>
                </CardFooter>
            </CardContent>
        </CardContainer>
    );
};