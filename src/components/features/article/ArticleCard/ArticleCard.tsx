// src/components/features/article/ArticleCard/ArticleCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { FolderArticle } from '../../../../types/folderArticles.types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';
import { HashtagList } from '../HashtagList';

// Default article image - a simple gray placeholder with text
const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

// Thêm wrapper div để gán ref và đảm bảo chiều cao đồng đều
const CardWrapper = styled.div`
    width: 100%;
    height: 100%; /* Đảm bảo chiều cao 100% của container cha */
    display: flex; /* Sử dụng flexbox để card bên trong có thể mở rộng */
`;

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%; /* Card sẽ mở rộng để lấp đầy wrapper */
`;

const ArticleImage = styled.div<{ imageUrl: string, isLoaded: boolean }>`
    height: 180px;
    background-image: url(${props => props.isLoaded ? props.imageUrl : DEFAULT_ARTICLE_IMAGE});
    background-size: cover;
    background-position: center;
    border-radius: ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg} 0 0;
    transition: background-image 0.3s ease;
    flex-shrink: 0; /* Ngăn không cho ảnh co lại */
`;

const ImageSkeleton = styled.div`
    height: 180px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg} 0 0;
    animation: shimmer 1.5s infinite;
    flex-shrink: 0; /* Ngăn không cho skeleton co lại */

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
`;

const ArticleContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1; /* Đảm bảo content mở rộng để lấp đầy không gian còn lại */
`;

const ArticleTitle = styled.h3`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0 0 12px 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Giới hạn tiêu đề trong 2 dòng */
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    height: 2.8em; /* Cố định chiều cao cho tiêu đề - 2 dòng */
`;

const ArticleExcerpt = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Giới hạn mô tả trong 3 dòng */
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
    height: 4.5em; /* Cố định chiều cao cho mô tả - 3 dòng */
    flex: 1; /* Mô tả sẽ mở rộng để lấp đầy không gian giữa tiêu đề và meta */
`;

const ArticleMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    padding-top: 12px;
    margin-top: auto; /* Đẩy phần meta xuống cuối */
`;

const ArticleSource = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 65%;

    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        flex-shrink: 0;
    }
`;

const ArticleDate = styled.div`
    white-space: nowrap;
`;

interface ArticleCardProps {
    article: Article | FolderArticle;
    onClick?: () => void;
    lazyLoad?: boolean;
    onHashtagClick?: (hashtag: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
                                                            article,
                                                            onClick,
                                                            lazyLoad = false,
                                                            onHashtagClick
                                                        }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(!lazyLoad);
    const [isInViewport, setIsInViewport] = useState(!lazyLoad);
    const cardRef = useRef<HTMLDivElement>(null);

    // Sử dụng image_url thay vì extract từ content HTML
    const imageUrl = article.image_url || DEFAULT_ARTICLE_IMAGE;

    // Intersection Observer cho lazy loading
    useEffect(() => {
        if (!lazyLoad) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInViewport(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [lazyLoad]);

    // Tải hình ảnh khi trong viewport
    useEffect(() => {
        if (!isInViewport || isImageLoaded) return;

        const img = new Image();
        img.src = imageUrl;
        img.onload = () => setIsImageLoaded(true);
    }, [isInViewport, isImageLoaded, imageUrl]);

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

    // Sử dụng content_snippet nếu có, nếu không thì extract từ content
    const content = article.content_snippet || article.content;
    const excerptText = extractTextFromHtml(content);

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
        <CardWrapper ref={cardRef}>
            <StyledCard onClick={onClick} padding="0">
                {isInViewport ? (
                    isImageLoaded ? (
                        <ArticleImage imageUrl={imageUrl} isLoaded={true} />
                    ) : (
                        <ImageSkeleton />
                    )
                ) : (
                    <ImageSkeleton />
                )}
                <ArticleContent>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleExcerpt>{excerptText}</ArticleExcerpt>

                    {/* Hiển thị hashtags trước meta info */}
                    {'hashtag' in article && article.hashtag && article.hashtag.length > 0 && (
                        <HashtagList 
                            hashtags={article.hashtag} 
                            limit={3} 
                            compact={true}
                            onClick={(e, hashtag) => {
                                e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
                                if (onHashtagClick) onHashtagClick(hashtag);
                            }}
                        />
                    )}

                    <ArticleMeta>
                        <ArticleSource>
                            <i className="fas fa-newspaper" />
                            {getSourceText()}
                        </ArticleSource>
                        <ArticleDate>{formatDate(new Date(article.publish_date))}</ArticleDate>
                    </ArticleMeta>
                </ArticleContent>
            </StyledCard>
        </CardWrapper>
    );
};