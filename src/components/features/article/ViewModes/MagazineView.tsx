// src/components/features/article/ViewModes/MagazineView.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate, truncateText } from '../../../../utils';

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,...'; // Giữ nguyên

const MagazineList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
`;

const MagazineItem = styled.div`
    display: flex;
    padding: 16px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background-color: ${({ theme }) => theme.colors.background.secondary};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
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
    line-height: 1.5;
`;

const Meta = styled.div`
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
        <MagazineList>
            {articles.map(article => {
                const excerptText = truncateText(extractTextFromHtml(article.content), 220);

                return (
                    <MagazineItem key={article.id} onClick={() => onArticleClick(article)}>
                        {article.image_url && (
                            <ArticleImage imageUrl={article.image_url || DEFAULT_ARTICLE_IMAGE} />
                        )}
                        <ArticleContent>
                            <Title>{article.title}</Title>
                            <Excerpt>{excerptText}</Excerpt>
                            <Meta>
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
                            </Meta>
                        </ArticleContent>
                    </MagazineItem>
                );
            })}
        </MagazineList>
    );
};