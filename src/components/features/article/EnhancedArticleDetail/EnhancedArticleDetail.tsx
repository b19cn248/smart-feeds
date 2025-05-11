// src/components/features/article/EnhancedArticleDetail/EnhancedArticleDetail.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { FolderArticle } from '../../../../types/folderArticles.types';
import { formatDate } from '../../../../utils';
import { useBoard } from '../../../../contexts/BoardContext';
import { useToast } from '../../../../contexts/ToastContext';
import { ArticleContentRenderer } from '../ArticleContentRenderer';

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

// Overlay với backdrop blur và transition cải thiện
const Overlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: ${({ theme }) => theme.zIndices.modal};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Cải thiện container với animation scale và box-shadow
const DetailContainer = styled.div<{ isOpen: boolean }>`
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    transform: ${({ isOpen }) => isOpen ? 'translateY(0) scale(1)' : 'translateY(-40px) scale(0.95)'};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease;
    position: relative;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.gray[400]};
        border-radius: 3px;
    }

    @media (prefers-color-scheme: dark) {
        background: ${({ theme }) => theme.colors.gray[800]};
        
        &::-webkit-scrollbar-thumb {
            background-color: ${({ theme }) => theme.colors.gray[600]};
        }
    }
`;

// Sticky header với backdrop filter
const DetailHeader = styled.header`
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    backdrop-filter: blur(8px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    z-index: 2;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    @media (prefers-color-scheme: dark) {
        background-color: rgba(30, 41, 59, 0.9);
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

// Cải thiện action buttons với hiệu ứng hover
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
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    
    &:before {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.primary.main};
        transition: all 0.3s ease;
        transform: translateX(-50%);
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.primary.main};
        transform: translateY(-2px);
        
        &:before {
            width: 70%;
        }
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

// Cải thiện ArticleTitle với line-height và màu sắc
const ArticleTitle = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 16px 0;
    line-height: 1.3;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    }
`;

// Nâng cao UI cho thông tin meta
const ArticleMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    
    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        color: ${({ theme }) => theme.colors.primary.main};
    }

    i {
        margin-right: 8px;
    }
`;

// Cải thiện ArticleImage với skeleton loading và transition
const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 24px;
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;
`;

const ArticleImage = styled.img`
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: ${({ theme }) => theme.radii.lg};
    transition: transform 0.5s ease;
    
    &:hover {
        transform: scale(1.02);
    }
`;

// Thêm ImageSkeleton cho loading state
const ImageSkeleton = styled.div`
    width: 100%;
    height: 300px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: ${({ theme }) => theme.radii.lg};
    margin-bottom: 24px;
    animation: shimmer 1.5s infinite;

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    @media (prefers-color-scheme: dark) {
        background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
        background-size: 200% 100%;
    }
`;

// Cải thiện nút Read More với hover effect
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
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary.hover};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        &:before {
            transform: translateX(0);
        }
    }
    
    i {
        transition: transform 0.3s ease;
    }
    
    &:hover i {
        transform: translateX(4px);
    }
`;

const ModalContainer = styled.div`
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
    width: 90%;
    max-width: 500px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 12px;
    padding: 24px;
    animation: slideIn 0.3s ease;
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (prefers-color-scheme: dark) {
        background-color: ${({ theme }) => theme.colors.gray[800]};
    }
    
    h3 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }
`;

// Cải thiện Share Options với animation
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
    background: ${({ theme }) => theme.colors.background.primary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 16px;
    width: 100px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }

    i {
        font-size: 24px;
        color: ${({ theme }) => theme.colors.primary.main};
        transition: transform 0.3s ease;
    }
    
    &:hover i {
        transform: scale(1.2);
    }

    span {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        color: ${({ theme }) => theme.colors.text.primary};
    }

    @media (prefers-color-scheme: dark) {
        background: ${({ theme }) => theme.colors.gray[800]};
        border-color: ${({ theme }) => theme.colors.gray[700]};

        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[700]};
        }
    }
`;

// Cải thiện URL sharing input
const ShareInput = styled.div`
    position: relative;

    input {
        width: 100%;
        padding: 12px 120px 12px 16px;
        border: 1px solid ${({ theme }) => theme.colors.gray[300]};
        border-radius: ${({ theme }) => theme.radii.md};
        font-size: ${({ theme }) => theme.typography.fontSize.md};
        transition: all 0.3s ease;
        
        &:focus {
            outline: none;
            border-color: ${({ theme }) => theme.colors.primary.main};
            box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.light};
        }

        @media (prefers-color-scheme: dark) {
            border-color: ${({ theme }) => theme.colors.gray[600]};
            background-color: ${({ theme }) => theme.colors.gray[700]};
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
        transition: all 0.3s ease;

        &:hover {
            background-color: ${({ theme }) => theme.colors.primary.hover};
            transform: translateY(-2px);
        }
    }
`;

// Cải thiện board selection UI
const BoardsList = styled.div`
    margin-top: 16px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.gray[400]};
        border-radius: 3px;
    }

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};
        
        &::-webkit-scrollbar-thumb {
            background-color: ${({ theme }) => theme.colors.gray[600]};
        }
    }
`;

const BoardItem = styled.div`
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        transform: translateX(4px);
    }

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};

        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[700]};
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
    transition: transform 0.2s ease;

    i {
        color: ${({ color }) => color};
        font-size: 16px;
    }
    
    ${BoardItem}:hover & {
        transform: scale(1.1);
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

// Thêm ModalFooter component với cải thiện UI cho buttons
const ModalFooter = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

const ModalButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.primary {
        background-color: ${({ theme }) => theme.colors.primary.main};
        color: white;
        
        &:hover {
            background-color: ${({ theme }) => theme.colors.primary.hover};
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    }
    
    &.secondary {
        background-color: ${({ theme }) => theme.colors.gray[200]};
        color: ${({ theme }) => theme.colors.text.primary};
        
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[300]};
            transform: translateY(-2px);
        }
        
        @media (prefers-color-scheme: dark) {
            background-color: ${({ theme }) => theme.colors.gray[700]};
            color: ${({ theme }) => theme.colors.text.secondary};
            
            &:hover {
                background-color: ${({ theme }) => theme.colors.gray[600]};
            }
        }
    }
`;

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
    const [shouldShowFeaturedImage, setShouldShowFeaturedImage] = useState(true);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // ĐƠN GIẢN HÓA logic kiểm tra hình ảnh trong nội dung
    useEffect(() => {
        if (!article || !isOpen) return;

        // Mặc định là hiển thị ảnh (thay đổi cách tiếp cận)
        setShouldShowFeaturedImage(true);

        // Chỉ kiểm tra nếu có image_url
        if (article.image_url) {
            setIsImageLoading(true);

            // Tự động preload image
            const img = new Image();
            img.src = article.image_url;
            img.onload = () => setIsImageLoading(false);
            img.onerror = () => {
                console.error('Failed to load image:', article.image_url);
                setIsImageLoading(false);
                setShouldShowFeaturedImage(false);
            };
        } else {
            setIsImageLoading(false);
            setShouldShowFeaturedImage(false);
        }
    }, [article, isOpen]);

    if (!article) return null;

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

                    {/* Cải thiện hiển thị hình ảnh với loading skeleton */}
                    {shouldShowFeaturedImage && article.image_url && (
                        <ImageContainer>
                            {isImageLoading ? (
                                <ImageSkeleton />
                            ) : (
                                <ArticleImage
                                    src={article.image_url}
                                    alt={article.title}
                                    onError={(e) => {
                                        console.error('Image failed to load');
                                        e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
                                    }}
                                />
                            )}
                        </ImageContainer>
                    )}

                    {/* Sử dụng ArticleContentRenderer để hiển thị nội dung */}
                    <ArticleContentRenderer
                        article={article}
                        className="article-content"
                    />

                    <ReadMoreLink href={article.url} target="_blank" rel="noopener noreferrer">
                        Read full article on original site
                        <i className="fas fa-external-link-alt" />
                    </ReadMoreLink>
                </DetailContent>

                {/* Cải thiện Modal UI cho Share */}
                {showShareModal && (
                    <ModalContainer>
                        <ModalContent>
                            <h3>Share Article</h3>
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
                                <button onClick={copyToClipboard}>Copy</button>
                            </ShareInput>

                            <ModalFooter>
                                <ModalButton
                                    className="secondary"
                                    onClick={() => setShowShareModal(false)}
                                >
                                    Close
                                </ModalButton>
                            </ModalFooter>
                        </ModalContent>
                    </ModalContainer>
                )}

                {/* Cải thiện Modal UI cho Save to Board */}
                {showSaveModal && (
                    <ModalContainer>
                        <ModalContent>
                            <h3>Save to Board</h3>
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

                            <ModalFooter>
                                <ModalButton
                                    className="secondary"
                                    onClick={() => setShowSaveModal(false)}
                                >
                                    Close
                                </ModalButton>
                            </ModalFooter>s
                        </ModalContent>
                    </ModalContainer>
                )}
            </DetailContainer>
        </Overlay>
    );
};