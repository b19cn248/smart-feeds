// src/components/features/article/ViewModes/MagazineView.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate, truncateText } from '../../../../utils';

// Default article image - a simple gray placeholder with text
const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const MagazineItem = styled.div`
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    padding: 24px 16px;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};

        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
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
        margin-right: 0;
        margin-bottom: 16px;
    }
`;

const ArticleContent = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 12px 0;
`;

const Excerpt = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0 0 16px 0;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Meta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const SourceName = styled.span`
    margin-right: 8px;
`;

const DateText = styled.span`
    &:before {
        content: '•';
        margin: 0 6px;
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
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

// Function to extract text from HTML content
const extractTextFromHtml = (html: string): string => {
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body.textContent || '';
        } catch (error) {
            console.error('Error parsing HTML content:', error);
        }
    }

    // Fallback: remove HTML tags with regex (not ideal but works as backup)
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

interface MagazineViewProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
    onSaveArticle?: (article: Article) => void;
}

export const MagazineView: React.FC<MagazineViewProps> = ({
                                                              articles,
                                                              onArticleClick,
                                                              onSaveArticle
                                                          }) => {
    return (
        <div>
            {articles.map(article => {
                const excerptText = truncateText(extractTextFromHtml(article.content), 200);

                return (
                    <MagazineItem key={article.id} onClick={() => onArticleClick(article)}>
                        {article.image_url && (
                            <ArticleImage imageUrl={article.image_url || DEFAULT_ARTICLE_IMAGE} />
                        )}
                        <ArticleContent>
                            <Title>{article.title}</Title>
                            <Excerpt>{excerptText}</Excerpt>
                            <Meta>
                                <div>
                                    <SourceName>
                                        {typeof article.source === 'string' ? article.source : 'Unknown source'}
                                    </SourceName>
                                    <DateText>{formatDate(new Date(article.publish_date))}</DateText>
                                </div>
                                <ActionButtons>
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
                                </ActionButtons>
                            </Meta>
                        </ArticleContent>
                    </MagazineItem>
                );
            })}
        </div>
    );
};