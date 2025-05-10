// src/components/features/article/ArticleDetail/ArticleDetail.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';
import { useBoard } from '../../../../contexts/BoardContext';
import { useToast } from '../../../../contexts/ToastContext';

const DetailOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: ${({ theme }) => theme.zIndices.modal - 1};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transition: ${({ theme }) => theme.transitions.default};
`;

const DetailPanel = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    width: 680px;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateX(${({ isOpen }) => isOpen ? '0' : '100%'});
    transition: transform ${({ theme }) => theme.transitions.default};
    z-index: ${({ theme }) => theme.zIndices.modal};
    overflow-y: auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
    }
`;

const DetailHeader = styled.div`
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    padding: 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.secondary};
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: ${({ theme }) => theme.colors.text.primary};
    }
`;

const DetailContent = styled.div`
    padding: 24px;
`;

const ArticleTitle = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 16px;
    line-height: 1.3;
`;

const ArticleMeta = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const ArticleSource = styled.div`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
    }
`;

const ArticleAuthor = styled.div`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
    }
`;

const ArticleDate = styled.div`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
    }
`;

const ArticleBody = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.primary};

    /* Styles cho nội dung HTML */
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
        border-left: 4px solid ${({ theme }) => theme.colors.gray[300]};
        margin: 16px 0;
        padding-left: 16px;
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

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    position: relative;
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.radii.md};
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    cursor: pointer;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};
        
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

const BoardsDropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    width: 240px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.md};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    z-index: 1000;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const DropdownHeader = styled.div`
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const DropdownContent = styled.div`
    max-height: 240px;
    overflow-y: auto;
`;

const BoardItem = styled.div`
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    &:last-child {
        border-bottom: none;
    }

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[800]};
        
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }

    i {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.text.secondary};
    }
`;

const EmptyBoardsList = styled.div`
    padding: 16px;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ArticleImage = styled.img`
    max-width: 100%;
    height: auto;
    display: block;
    margin: 16px auto;
    border-radius: ${({ theme }) => theme.radii.md};
`;

interface ArticleDetailProps {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
                                                                article,
                                                                isOpen,
                                                                onClose,
                                                            }) => {
    const { boards, addArticleToBoard } = useBoard();
    const { showToast } = useToast();
    const [showBoardsMenu, setShowBoardsMenu] = useState(false);

    if (!article) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleAddToBoard = async (boardId: number) => {
        if (!article) return;

        try {
            await addArticleToBoard(boardId, { article_id: article.id });
            showToast('success', 'Success', 'Article added to board successfully');
            setShowBoardsMenu(false);
        } catch (error) {
            showToast('error', 'Error', 'Failed to add article to board');
        }
    };

    // Sanitize HTML content để tránh XSS attacks
    const sanitizeHtml = (html: string) => {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                'p', 'br', 'b', 'i', 'em', 'strong', 'a',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
                'div', 'span'
                // Đã xóa 'img' khỏi danh sách thẻ được phép
            ],
            ALLOWED_ATTR: [
                'href', 'alt', 'title', 'class', 'id',
                'width', 'height', 'target', 'rel'
                // Đã xóa 'src' khỏi danh sách attributes được phép
            ],
            ALLOW_DATA_ATTR: false
        });
    };

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

    // Sử dụng image_url trực tiếp thay vì extractFirstImage từ content
    const featuredImage = article.image_url;
    const sanitizedContent = sanitizeHtml(article.content);

    return (
        <>
            <DetailOverlay isOpen={isOpen} onClick={handleOverlayClick} />
            <DetailPanel isOpen={isOpen}>
                <DetailHeader>
                    <ActionButtons>
                        <ActionButton onClick={() => window.open(article.url, '_blank')}>
                            <i className="fas fa-external-link-alt" />
                            Open original
                        </ActionButton>
                        <ActionButton onClick={() => setShowBoardsMenu(!showBoardsMenu)}>
                            <i className="fas fa-clipboard" />
                            Add to board
                        </ActionButton>
                        <ActionButton>
                            <i className="fas fa-share" />
                            Share
                        </ActionButton>

                        {showBoardsMenu && (
                            <BoardsDropdown>
                                <DropdownHeader>Select a board</DropdownHeader>
                                <DropdownContent>
                                    {boards.length > 0 ? (
                                        boards.map(board => (
                                            <BoardItem
                                                key={board.id}
                                                onClick={() => handleAddToBoard(board.id)}
                                            >
                                                <i className={`fas fa-${board.icon || 'clipboard'}`} />
                                                {board.name}
                                            </BoardItem>
                                        ))
                                    ) : (
                                        <EmptyBoardsList>
                                            No boards available. Create a board first.
                                        </EmptyBoardsList>
                                    )}
                                </DropdownContent>
                            </BoardsDropdown>
                        )}
                    </ActionButtons>
                    <CloseButton onClick={onClose}>
                        <i className="fas fa-times" />
                    </CloseButton>
                </DetailHeader>

                <DetailContent>
                    <ArticleTitle>{article.title}</ArticleTitle>

                    {/* Hiển thị featured image từ image_url nếu có */}
                    {featuredImage && (
                        <ArticleImage
                            src={featuredImage}
                            alt={article.title}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    )}

                    <ArticleMeta>
                        <ArticleSource>
                            <i className="fas fa-newspaper" />
                            {getSourceText()}
                        </ArticleSource>
                        {article.author && (
                            <ArticleAuthor>
                                <i className="fas fa-user" />
                                {article.author}
                            </ArticleAuthor>
                        )}
                        <ArticleDate>
                            <i className="fas fa-calendar" />
                            {formatDate(new Date(article.publish_date))}
                        </ArticleDate>
                    </ArticleMeta>

                    <ArticleBody
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                </DetailContent>
            </DetailPanel>
        </>
    );
};