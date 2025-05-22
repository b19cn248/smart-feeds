import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../types';
import { formatDate } from '../../../utils';
import { Button } from '../../common/Button';

interface SourceObject {
    url: string;
    name?: string;
}

interface ArticleCardProps {
    article: Article;
    onRemove: (articleId: number) => void;
    onView: (article: Article) => void;
}

const ArticleCardContainer = styled.div`
    position: relative;
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;
    transition: ${({ theme }) => theme.transitions.default};
    cursor: pointer;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }
`;

const ArticleImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const ArticleContent = styled.div`
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ArticleTitle = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const ArticleMeta = styled.div`
    display: flex;
    gap: 16px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 12px;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

    i {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
`;

const ArticleDescription = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const ArticleActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const TeamBoardArticleCard: React.FC<ArticleCardProps> = ({ article, onRemove, onView }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onView(article);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(article.id);
    };

    const getSourceText = () => {
        if (!article.source) return 'Unknown source';
        if (typeof article.source === 'object' && article.source !== null) {
            const sourceObj = article.source as SourceObject;
            return sourceObj.url || sourceObj.name || 'Unknown source';
        }
        return String(article.source);
    };

    return (
        <ArticleCardContainer onClick={handleClick}>
            {article.image_url && (
                <ArticleImage 
                    src={article.image_url} 
                    alt={article.title}
                    onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                    }}
                />
            )}
            <ArticleContent>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleMeta>
                    <MetaItem>
                        <i className="fas fa-newspaper" />
                        {getSourceText()}
                    </MetaItem>
                    <MetaItem>
                        <i className="fas fa-calendar" />
                        {formatDate(new Date(article.publish_date))}
                    </MetaItem>
                </ArticleMeta>
                <ArticleDescription>
                    {article.content?.substring(0, 150)}...
                </ArticleDescription>
            </ArticleContent>
            <ArticleActions>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemove}
                    leftIcon="trash"
                >
                    Remove
                </Button>
            </ArticleActions>
        </ArticleCardContainer>
    );
}; 