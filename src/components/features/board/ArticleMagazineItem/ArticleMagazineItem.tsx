// src/components/features/board/ArticleMagazineItem/ArticleMagazineItem.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';

// Default image when article has no image
const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const MagazineItem = styled.div`
    display: flex;
    padding: 16px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

const ArticleImage = styled.div<{ imageUrl: string }>`
    width: 240px;
    height: 160px;
    flex-shrink: 0;
    border-radius: ${({ theme }) => theme.radii.md};
    background-image: url(${props => props.imageUrl});
    background-size: cover;
    background-position: center;
    margin-right: 24px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        height: 180px;
        margin-right: 0;
        margin-bottom: 16px;
    }
`;

const ArticleContentWrapper = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
`;

const ArticleTitle = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
`;

const ArticleExcerpt = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0 0 16px 0;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
`;

const ArticleMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const SourceInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const SourceName = styled.span`
    display: flex;
    align-items: center;
    
    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const DateText = styled.span`
    display: flex;
    align-items: center;
    
    &:before {
        content: '•';
        margin: 0 6px;
    }
    
    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.gray[500]};
    padding: 4px 8px;
    font-size: 14px;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.radii.sm};
    
    &:hover {
        color: ${({ theme }) => theme.colors.primary.main};
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }
`;

// Utility function to extract text from HTML content
const extractTextFromHtml = (html: string): string => {
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    } catch (error) {
        console.error('Error parsing HTML content:', error);
        return html;
    }
};

interface ArticleMagazineItemProps {
    article: Article;
    onArticleClick: (article: Article) => void;
    onDeleteClick: (article: Article) => void;
}

export const ArticleMagazineItem: React.FC<ArticleMagazineItemProps> = ({
                                                                            article,
                                                                            onArticleClick,
                                                                            onDeleteClick
                                                                        }) => {
    return (
        <MagazineItem onClick={() => onArticleClick(article)}>
            <ArticleImage
                imageUrl={article.image_url || DEFAULT_ARTICLE_IMAGE}
            />
            <ArticleContentWrapper>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleExcerpt>
                    {extractTextFromHtml(article.content).substring(0, 220)}
                </ArticleExcerpt>
                <ArticleMeta>
                    <SourceInfo>
                        <SourceName>
                            <i className="fas fa-newspaper" />
                            {typeof article.source === 'string' ? article.source : 'Unknown source'}
                        </SourceName>
                        <DateText>
                            <i className="fas fa-calendar" />
                            {formatDate(new Date(article.publish_date))}
                        </DateText>
                    </SourceInfo>
                    <ActionButtons>
                        <ActionButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(article);
                            }}
                            title="Remove from board"
                        >
                            <i className="fas fa-times" />
                        </ActionButton>
                        <ActionButton
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(article.url, '_blank');
                            }}
                            title="Open original"
                        >
                            <i className="fas fa-external-link-alt" />
                        </ActionButton>
                    </ActionButtons>
                </ArticleMeta>
            </ArticleContentWrapper>
        </MagazineItem>
    );
};