// src/components/features/article/ArticleCard/ArticleCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';

// Default article image - a simple gray placeholder with text
const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const ArticleImage = styled.div<{ imageUrl: string }>`
    height: 180px;
    background-image: url(${props => props.imageUrl});
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
    // Sử dụng image_url thay vì extract từ content HTML
    const imageUrl = article.image_url || DEFAULT_ARTICLE_IMAGE;

    // Extract text từ HTML để hiển thị excerpt
    const extractTextFromHtml = (html: string): string => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body.textContent || '';
        } catch (error) {
            console.error('Error parsing HTML content:', error);
            return html;
        }
    };

    // Extract text từ HTML để hiển thị excerpt
    const excerptText = extractTextFromHtml(article.content);

    // Xác định nguồn bài viết
    const getSourceText = () => {
        if (!article.source) return 'Unknown source';
        if (typeof article.source === 'object' && article.source !== null) {
            // Sử dụng any để tránh lỗi TypeScript
            const sourceObj = article.source as any;
            return sourceObj.url || 'Unknown source';
        }
        return String(article.source);
    };

    return (
        <Card onClick={onClick} padding="0">
            <ArticleImage imageUrl={imageUrl} />
            <ArticleContent>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleExcerpt>{excerptText}</ArticleExcerpt>
                <ArticleMeta>
                    <ArticleSource>
                        <i className="fas fa-newspaper" />
                        {getSourceText()}
                    </ArticleSource>
                    <ArticleDate>{formatDate(new Date(article.publish_date))}</ArticleDate>
                </ArticleMeta>
            </ArticleContent>
        </Card>
    );
};