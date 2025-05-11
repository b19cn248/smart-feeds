// src/components/features/article/EnhancedArticleDetail/EnhancedArticleDetail.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { Article } from '../../../../types';
import { FolderArticle } from '../../../../types/folderArticles.types';
import { formatDate } from '../../../../utils';
import { useBoard } from '../../../../contexts/BoardContext';
import { useToast } from '../../../../contexts/ToastContext';

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

// Overlay to dim the background
const Overlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    z-index: ${({ theme }) => theme.zIndices.modal};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transition: ${({ theme }) => theme.transitions.default};
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Modal style detail view
const DetailContainer = styled.div<{ isOpen: boolean }>`
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-20px)'};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    transition: ${({ theme }) => theme.transitions.default};
    position: relative;

    @media (prefers-color-scheme: dark) {
        background: ${({ theme }) => theme.colors.gray[800]};
    }
`;

const DetailHeader = styled.header`
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    z-index: 1;

    @media (prefers-color-scheme: dark) {
        background-color: ${({ theme }) => theme.colors.gray[800]};
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const HeaderTitle = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const HeaderActions = styled.div`
    display: flex;
    gap: 12px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    cursor: pointer;
    padding: 8px;
    border-radius: ${({ theme }) => theme.radii.md};
    transition: ${({ theme }) => theme.transitions.default};
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.text.primary};
    }

    @media (prefers-color-scheme: dark) {
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[700]};
        }
    }

    span {
        @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
            display: none;
        }
    }
`;

const DetailContent = styled.div`
    padding: 32px 24px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: 24px 16px;
    }
`;

const ArticleTitle = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 16px 0;
    line-height: 1.3;
`;

const ArticleMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;

    i {
        margin-right: 8px;
    }
`;

const ArticleImage = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.radii.lg};
    margin-bottom: 24px;
`;

const ArticleBody = styled.div`
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
        margin: 16px 0;
        border-radius: ${({ theme }) => theme.radii.md};
    }

    a {
        color: ${({ theme }) => theme.colors.primary.main};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 24px 0 16px 0;
        font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    }

    ul, ol {
        margin: 16px 0;
        padding-left: 24px;
    }

    li {
        margin-bottom: 8px;
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
`;

const ReadMoreLink = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    padding: 12px 24px;
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
    border-radius: ${({ theme }) => theme.radii.md};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary.hover};
        transform: translateY(-2px);
    }
`;

const ShareOptions = styled.div`
    padding: 16px;
`;

const ShareOptionsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
`;

const ShareOption = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 16px;
    width: 100px;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        transform: translateY(-2px);
    }

    i {
        font-size: 24px;
        color: ${({ theme }) => theme.colors.primary.main};
    }

    span {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        color: ${({ theme }) => theme.colors.text.primary};
    }

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};

        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

const ShareInput = styled.div`
    position: relative;

    input {
        width: 100%;
        padding: 12px 120px 12px 16px;
        border: 1px solid ${({ theme }) => theme.colors.gray[300]};
        border-radius: ${({ theme }) => theme.radii.md};
        font-size: ${({ theme }) => theme.typography.fontSize.md};

        @media (prefers-color-scheme: dark) {
            border-color: ${({ theme }) => theme.colors.gray[600]};
            background-color: ${({ theme }) => theme.colors.gray[800]};
            color: ${({ theme }) => theme.colors.text.primary};
        }
    }

    button {
        position: absolute;
        right: 4px;
        top: 4px;
        padding: 8px 16px;
        background-color: ${({ theme }) => theme.colors.primary.main};
        color: white;
        border: none;
        border-radius: ${({ theme }) => theme.radii.md};
        cursor: pointer;

        &:hover {
            background-color: ${({ theme }) => theme.colors.primary.hover};
        }
    }
`;

// Board selection
const SaveToBoard = styled.div`
    padding: 16px;
`;

const BoardsList = styled.div`
    margin-top: 16px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const BoardItem = styled.div`
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};

        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

const BoardIcon = styled.div<{ color: string }>`
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ color }) => `${color}20`};
    display: flex;
    align-items: center;
    justify-content: center;

    i {
        color: ${({ color }) => color};
        font-size: 16px;
    }
`;

const BoardInfo = styled.div`
    flex: 1;
`;

const BoardName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const BoardDescription = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

// Hàm chuẩn hóa URL để so sánh
const normalizeUrl = (url: string): string => {
    if (!url) return '';

    // Xóa protocol (http, https)
    let normalized = url.replace(/^https?:\/\//, '');

    // Xóa www. nếu có
    normalized = normalized.replace(/^www\./, '');

    // Xóa query parameters (tất cả sau dấu ?)
    normalized = normalized.split('?')[0];

    // Xóa fragment (tất cả sau dấu #)
    normalized = normalized.split('#')[0];

    // Xóa trailing slash nếu có
    normalized = normalized.replace(/\/$/, '');

    return normalized.toLowerCase();
};

// Hàm so sánh URLs với độ chính xác cao hơn
const areUrlsSimilar = (url1: string, url2: string): boolean => {
    // So sánh trực tiếp sau khi chuẩn hóa
    if (url1 === url2) return true;

    // Kiểm tra nếu url1 chứa url2 hoặc ngược lại (cho trường hợp URLs có thêm path)
    if (url1.includes(url2) || url2.includes(url1)) return true;

    // Kiểm tra phần tên file
    const filename1 = url1.split('/').pop();
    const filename2 = url2.split('/').pop();
    if (filename1 && filename2 && filename1 === filename2) return true;

    return false;
};

// Hàm xử lý HTML để loại bỏ ảnh trùng lặp
const processHtmlContent = (htmlContent: string, featuredImage?: string): string => {
    if (!featuredImage) return htmlContent;

    try {
        // Tạo DOM parser để xử lý HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Lấy tất cả các ảnh trong nội dung
        const images = Array.from(doc.querySelectorAll('img'));

        // Chuẩn hóa URL của featured image để so sánh
        const normalizedFeaturedImage = normalizeUrl(featuredImage);

        // Kiểm tra từng ảnh và xóa nếu trùng lặp
        let foundDuplicate = false;
        for (const img of images) {
            const imgSrc = img.getAttribute('src');
            if (!imgSrc) continue;

            // Chuẩn hóa URL của ảnh trong nội dung
            const normalizedImgSrc = normalizeUrl(imgSrc);

            // So sánh với featured image
            if (areUrlsSimilar(normalizedFeaturedImage, normalizedImgSrc)) {
                // Xóa ảnh trùng lặp
                if (img.parentNode) {
                    img.parentNode.removeChild(img);
                    foundDuplicate = true;
                    break; // Chỉ xóa ảnh trùng lặp đầu tiên
                }
            }
        }

        // Nếu tìm thấy ảnh trùng lặp
        if (foundDuplicate) {
            return doc.body.innerHTML;
        }

        return htmlContent;
    } catch (error) {
        console.error('Error processing HTML content:', error);
        return htmlContent;
    }
};

// Props type supports both regular Article and FolderArticle
interface EnhancedArticleDetailProps {
    article: (Article | FolderArticle | null);
    isOpen: boolean;
    onClose: () => void;
}

export const EnhancedArticleDetail: React.FC<EnhancedArticleDetailProps> = ({
                                                                                article,
                                                                                isOpen,
                                                                                onClose
                                                                            }) => {
    const { boards, addArticleToBoard } = useBoard();
    const { showToast } = useToast();
    const [showShareModal, setShowShareModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [processedContent, setProcessedContent] = useState<string>('');
    const [shouldShowFeaturedImage, setShouldShowFeaturedImage] = useState(true);

    // Xử lý khi article hoặc isOpen thay đổi
    useEffect(() => {
        if (!article || !isOpen) return;

        // Lấy nội dung bài viết
        const content = 'content_encoded' in article && article.content_encoded
            ? article.content_encoded
            : article.content;

        // Xử lý nội dung để loại bỏ ảnh trùng lặp
        if (article.image_url) {
            const processed = processHtmlContent(content, article.image_url);
            setProcessedContent(processed);

            // Nếu nội dung thay đổi, tức là đã tìm và xóa ảnh trùng lặp
            setShouldShowFeaturedImage(processed === content);
        } else {
            setProcessedContent(content);
            setShouldShowFeaturedImage(true);
        }
    }, [article, isOpen]);

    if (!article) return null;

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(processedContent || article.content, {
        ALLOWED_TAGS: [
            'p', 'br', 'b', 'i', 'em', 'strong', 'a',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
            'div', 'span', 'img'
        ],
        ALLOWED_ATTR: [
            'href', 'alt', 'title', 'class', 'id',
            'src', 'width', 'height', 'target', 'rel'
        ]
    });

    const handleSaveToBoard = async (boardId: number) => {
        try {
            await addArticleToBoard(boardId, { article_id: article.id });
            showToast('success', 'Success', 'Article saved to board successfully');
            setShowSaveModal(false);
        } catch (error) {
            showToast('error', 'Error', 'Failed to save article to board');
        }
    };

    const handleShare = (platform: string) => {
        let shareUrl = '';
        const text = encodeURIComponent(`${article.title} | ${article.url}`);

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
        setShowShareModal(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(article.url)
            .then(() => {
                showToast('success', 'Success', 'URL copied to clipboard');
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to copy URL');
            });
    };

    // Handle clicks on overlay to close the modal
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
            <DetailContainer isOpen={isOpen}>
                <DetailHeader>
                    <HeaderTitle>{article.title}</HeaderTitle>
                    <HeaderActions>
                        <ActionButton onClick={() => setShowSaveModal(true)} title="Save to board">
                            <i className="fas fa-bookmark" />
                            <span>Save</span>
                        </ActionButton>
                        <ActionButton onClick={() => setShowShareModal(true)} title="Share article">
                            <i className="fas fa-share-alt" />
                            <span>Share</span>
                        </ActionButton>
                        <ActionButton onClick={() => window.open(article.url, '_blank')} title="Read original">
                            <i className="fas fa-external-link-alt" />
                            <span>Original</span>
                        </ActionButton>
                        <ActionButton onClick={onClose} title="Close">
                            <i className="fas fa-times" />
                        </ActionButton>
                    </HeaderActions>
                </DetailHeader>

                <DetailContent>
                    <ArticleTitle>{article.title}</ArticleTitle>

                    <ArticleMeta>
                        <MetaItem>
                            <i className="fas fa-newspaper" />
                            {typeof article.source === 'string' ? article.source : 'Unknown source'}
                        </MetaItem>
                        {article.author && (
                            <MetaItem>
                                <i className="fas fa-user" />
                                {article.author}
                            </MetaItem>
                        )}
                        <MetaItem>
                            <i className="fas fa-calendar" />
                            {formatDate(new Date(article.publish_date))}
                        </MetaItem>
                    </ArticleMeta>

                    {/* Hiển thị featured image chỉ khi không tìm thấy trùng lặp trong nội dung */}
                    {shouldShowFeaturedImage && article.image_url && (
                        <ArticleImage
                            src={article.image_url}
                            alt={article.title}
                            onError={(e) => {
                                e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
                            }}
                        />
                    )}

                    <ArticleBody dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

                    <ReadMoreLink href={article.url} target="_blank" rel="noopener noreferrer">
                        Read full article on original site
                        <i className="fas fa-external-link-alt" />
                    </ReadMoreLink>
                </DetailContent>

                {/* Share Modal */}
                {showShareModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div style={{ width: '90%', maxWidth: '500px', backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
                            <h3 style={{ marginTop: 0 }}>Share Article</h3>
                            <ShareOptionsList>
                                <ShareOption onClick={() => handleShare('twitter')}>
                                    <i className="fab fa-twitter" />
                                    <span>Twitter</span>
                                </ShareOption>
                                <ShareOption onClick={() => handleShare('facebook')}>
                                    <i className="fab fa-facebook" />
                                    <span>Facebook</span>
                                </ShareOption>
                                <ShareOption onClick={() => handleShare('linkedin')}>
                                    <i className="fab fa-linkedin" />
                                    <span>LinkedIn</span>
                                </ShareOption>
                                <ShareOption onClick={() => handleShare('email')}>
                                    <i className="fas fa-envelope" />
                                    <span>Email</span>
                                </ShareOption>
                            </ShareOptionsList>

                            <ShareInput>
                                <input type="text" value={article.url} readOnly />
                                <button onClick={copyToClipboard}>Copy URL</button>
                            </ShareInput>

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    onClick={() => setShowShareModal(false)}
                                >Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save to Board Modal */}
                {showSaveModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div style={{ width: '90%', maxWidth: '500px', backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
                            <h3 style={{ marginTop: 0 }}>Save to Board</h3>
                            <p>Select a board to save this article:</p>

                            <BoardsList>
                                {boards.length > 0 ? (
                                    boards.map(board => (
                                        <BoardItem
                                            key={board.id}
                                            onClick={() => handleSaveToBoard(board.id)}
                                        >
                                            <BoardIcon color={board.color}>
                                                <i className={`fas fa-${board.icon || 'clipboard'}`} />
                                            </BoardIcon>
                                            <BoardInfo>
                                                <BoardName>{board.name}</BoardName>
                                                {board.description && (
                                                    <BoardDescription>{board.description}</BoardDescription>
                                                )}
                                            </BoardInfo>
                                        </BoardItem>
                                    ))
                                ) : (
                                    <div style={{ padding: '16px', textAlign: 'center' }}>
                                        You don't have any boards. Create a board first.
                                    </div>
                                )}
                            </BoardsList>

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    onClick={() => setShowSaveModal(false)}
                                >Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </DetailContainer>
        </Overlay>
    );
};