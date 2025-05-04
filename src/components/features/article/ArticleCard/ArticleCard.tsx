// src/components/features/article/ArticleCard/ArticleCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';

const ArticleImage = styled.div<{ imageUrl: string }>`
  height: 180px;
  background-image: url(${props => props.imageUrl || '/article-placeholder.jpg'});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg} 0 0;
`;

const ArticleContent = styled.div`
  padding: 20px;
`;

const ArticleTitle = styled.h3`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const ArticleExcerpt = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-top: 12px;
  
  @media (prefers-color-scheme: dark) {
    border-top-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ArticleSource = styled.div`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 6px;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const ArticleDate = styled.div``;

interface ArticleCardProps {
    article: Article;
    onClick?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
                                                            article,
                                                            onClick
                                                        }) => {
    return (
        <Card onClick={onClick} padding="0">
            <ArticleImage imageUrl={article.imageUrl ?? '/article-placeholder.jpg'} />
            <ArticleContent>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleExcerpt>{article.content}</ArticleExcerpt>
                <ArticleMeta>
                    <ArticleSource>
                        <i className="fas fa-newspaper" />
                        {article.source}
                    </ArticleSource>
                    <ArticleDate>{formatDate(article.publishedAt)}</ArticleDate>
                </ArticleMeta>
            </ArticleContent>
        </Card>
    );
};