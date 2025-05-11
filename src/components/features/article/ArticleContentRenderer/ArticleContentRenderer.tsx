// src/components/features/article/ArticleContentRenderer/ArticleContentRenderer.tsx
import React from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { Article } from '../../../../types';
import { FolderArticle } from '../../../../types/folderArticles.types';

const ContentContainer = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    line-height: 1.7;

    p {
        margin-bottom: 16px;
    }

    img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 16px auto; /* Đảm bảo ảnh được căn giữa */
        border-radius: ${({ theme }) => theme.radii.md};
    }

    a {
        color: ${({ theme }) => theme.colors.primary.main};
        text-decoration: none;
        transition: ${({ theme }) => theme.transitions.default};

        &:hover {
            text-decoration: underline;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 24px 0 16px 0;
        font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
        line-height: 1.3;
    }

    ul, ol {
        margin: 16px 0;
        padding-left: 24px;

        li {
            margin-bottom: 8px;
        }
    }

    blockquote {
        border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
        margin: 16px 0;
        padding: 16px 0 16px 16px;
        font-style: italic;
        color: ${({ theme }) => theme.colors.text.secondary};
    }

    pre {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        padding: 16px;
        border-radius: ${({ theme }) => theme.radii.md};
        overflow-x: auto;
        margin: 16px 0;

        @media (prefers-color-scheme: dark) {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }

    code {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        padding: 2px 4px;
        border-radius: ${({ theme }) => theme.radii.sm};
        font-family: monospace;

        @media (prefers-color-scheme: dark) {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }

    hr {
        margin: 24px 0;
        border: 0;
        height: 1px;
        background-color: ${({ theme }) => theme.colors.gray[200]};

        @media (prefers-color-scheme: dark) {
            background-color: ${({ theme }) => theme.colors.gray[700]};
        }
    }

    /* Cải thiện hiển thị khi có button trong content */
    .button-wrapper {
        margin: 16px 0;
        display: flex;
        justify-content: center;

        a.button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            border-radius: ${({ theme }) => theme.radii.md};
            font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
            text-decoration: none;
            transition: ${({ theme }) => theme.transitions.default};

            &.primary {
                background-color: ${({ theme }) => theme.colors.primary.main};
                color: white;

                &:hover {
                    background-color: ${({ theme }) => theme.colors.primary.hover};
                }
            }
        }
    }
`;

interface ArticleContentRendererProps {
    article: Article | FolderArticle;
    featuredImage?: string;
    className?: string;
    skipImageProcessing?: boolean; // Thêm prop mới để có thể bỏ qua xử lý ảnh
}

const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
                                                                           article,
                                                                           featuredImage,
                                                                           className,
                                                                           skipImageProcessing = false
                                                                       }) => {
    // Xử lý HTML để tối ưu hiển thị
    const processHtmlContent = (htmlContent: string, imageUrl?: string): string => {
        if (!htmlContent) return '';
        if (skipImageProcessing) return htmlContent; // Bỏ qua xử lý ảnh nếu được yêu cầu

        try {
            // Tạo DOM parser để xử lý HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            // Xử lý các link để mở trong tab mới
            const links = Array.from(doc.querySelectorAll('a'));
            links.forEach(link => {
                if (link.getAttribute('href') && !link.getAttribute('target')) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });

            // Đảm bảo các ảnh có thuộc tính alt và loading
            const images = Array.from(doc.querySelectorAll('img'));
            images.forEach(img => {
                if (!img.getAttribute('alt')) {
                    img.setAttribute('alt', 'Article image');
                }
                img.setAttribute('loading', 'lazy');
                img.classList.add('article-image');
            });

            return doc.body.innerHTML;
        } catch (error) {
            console.error('Error processing HTML content:', error);
            return htmlContent;
        }
    };

    // Ưu tiên content_encoded nếu có
    const hasContentEncoded = !!article.content_encoded && article.content_encoded.length > 0;
    const content = hasContentEncoded ? article.content_encoded! : article.content;

    // Xử lý nội dung HTML
    const processedContent = processHtmlContent(content, featuredImage || article.image_url);

    // Sanitize HTML để tránh XSS
    const sanitizedContent = DOMPurify.sanitize(processedContent, {
        ALLOWED_TAGS: [
            'p', 'br', 'b', 'i', 'em', 'strong', 'a',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
            'div', 'span', 'img', 'hr'
        ],
        ALLOWED_ATTR: [
            'href', 'alt', 'title', 'class', 'id',
            'src', 'width', 'height', 'target', 'rel', 'loading'
        ],
        ADD_ATTR: ['target', 'loading'], // Tự động thêm target="_blank" và loading="lazy"
    });

    return (
        <ContentContainer
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
    );
};

export default ArticleContentRenderer;