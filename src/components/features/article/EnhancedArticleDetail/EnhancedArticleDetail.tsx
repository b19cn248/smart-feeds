// src/components/features/article/EnhancedArticleDetail/EnhancedArticleDetail.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';
import { useBoard } from '../../../../contexts/BoardContext';
import { useToast } from '../../../../contexts/ToastContext';
import { Modal } from '../../../common/Modal';
import { Button } from '../../../common/Button';

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

// Modal-style detail view
const DetailOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  z-index: ${({ theme }) => theme.zIndices.modal};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: ${({ theme }) => theme.transitions.default};
  overflow-y: auto;
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
  max-width: 800px;
  margin: 0 auto;
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

// Board selection dropdown
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

interface EnhancedArticleDetailProps {
    article: Article | null;
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

    if (!article) return null;

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(article.content, {
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

    return (
        <>
            <DetailOverlay isOpen={isOpen}>
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

                    {article.image_url && (
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
            </DetailOverlay>

            {/* Share Modal */}
            <Modal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title="Share Article"
                size="md"
            >
                <ShareOptions>
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
                </ShareOptions>
            </Modal>

            {/* Save to Board Modal */}
            <Modal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                title="Save to Board"
                size="md"
            >
                <SaveToBoard>
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
                </SaveToBoard>
            </Modal>
        </>
    );
};