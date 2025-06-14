import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Article } from '../../../types';
import { formatDate } from '../../../utils';
import { ArticleContentRenderer } from '../../features/article/ArticleContentRenderer';
import { HashtagList } from './EnhancedArticleDetail/../HashtagList';
import { ShareModal } from './EnhancedArticleDetail/ShareModal';
import { SaveToBoardModal } from './EnhancedArticleDetail/SaveToBoardModal';
import { SaveToTeamBoardModal } from './EnhancedArticleDetail/SaveToTeamBoardModal';
import { useArticleImage } from '../../../hooks/useArticleImage';

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const Overlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
    z-index: ${({ theme }) => theme.zIndices.modal};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: ${({ theme }) => theme.transitions.default};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DetailContainer = styled.div<{ isOpen: boolean }>`
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    width: 90vw;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-20px)')};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transition: ${({ theme }) => theme.transitions.default};
    position: relative;
    display: flex;
    flex-direction: column;
`;

const DetailHeader = styled.header`
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px 16px 32px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    z-index: 1;
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
    position: relative;
    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.text.primary};
    }
    span {
        @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
            display: none;
        }
    }
`;

const SaveDropdown = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: 100%;
    right: 0;
    width: 200px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.md};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    z-index: 1000;
    overflow: hidden;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
    transition: all 0.2s ease-in-out;
`;

const DropdownItem = styled.button`
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text.primary};
    transition: background-color 0.2s;
    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }
    i {
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const ArticleSection = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 32px;
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

const HashtagSection = styled.div`
    margin: 16px 0 24px 0;
`;

const ArticleImage = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.radii.lg};
    margin: 0 auto 24px auto;
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition: transform 0.3s ease;
    display: block;
    &:hover {
        transform: scale(1.01);
    }
`;

const ArticleContent = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 32px;
    img {
        max-width: 100%;
        display: block;
        margin: 16px auto;
        border-radius: ${({ theme }) => theme.radii.md};
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 32px;
`;

const ReadMoreButton = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
    border-radius: ${({ theme }) => theme.radii.md};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    transition: all 0.3s ease;
    box-shadow: ${({ theme }) => theme.shadows.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    &:hover {
        background-color: ${({ theme }) => theme.colors.primary.hover};
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }
    i {
        font-size: ${({ theme }) => theme.typography.fontSize.md};
    }
`;

interface HomeArticleDetailProps {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
}

export const HomeArticleDetail: React.FC<HomeArticleDetailProps> = ({
    article,
    isOpen,
    onClose
}) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showTeamSaveModal, setShowTeamSaveModal] = useState(false);
    const [showSaveDropdown, setShowSaveDropdown] = useState(false);
    const { shouldShowFeaturedImage, imageSrc } = useArticleImage(article);
    const contentRef = useRef<HTMLDivElement>(null);
    const [hasImageInContent, setHasImageInContent] = useState(false);

    useEffect(() => {
        if (contentRef.current && article?.image_url) {
            const duplicateImages = contentRef.current.querySelectorAll('.featured-image-in-content');
            setHasImageInContent(duplicateImages.length > 0);
        }
    }, [article, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const dropdown = document.getElementById('save-dropdown');
            const saveButton = document.getElementById('save-button');
            if (dropdown && !dropdown.contains(target) &&
                saveButton && !saveButton.contains(target)) {
                setShowSaveDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!article) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const toggleSaveDropdown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSaveDropdown(!showSaveDropdown);
    };
    const handleSaveToBoard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSaveDropdown(false);
        setShowSaveModal(true);
    };
    const handleSaveToTeamBoard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSaveDropdown(false);
        setShowTeamSaveModal(true);
    };
    const handleOpenOriginal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(article.url, '_blank');
    };
    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowShareModal(true);
    };
    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };
    const getSourceText = () => {
        if (!article.source) return 'Unknown source';
        if (typeof article.source === 'object' && article.source !== null) {
            const sourceObj = article.source as Record<string, any>;
            return sourceObj.url || 'Unknown source';
        }
        return String(article.source);
    };

    return (
        <>
            <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
                <DetailContainer isOpen={isOpen}>
                    <DetailHeader>
                        <HeaderTitle>{article.title}</HeaderTitle>
                        <HeaderActions>
                            <div style={{ position: 'relative' }}>
                                <ActionButton
                                    id="save-button"
                                    onClick={toggleSaveDropdown}
                                    title="Save options"
                                >
                                    <i className="fas fa-bookmark" />
                                    <span>Save</span>
                                </ActionButton>
                                <SaveDropdown id="save-dropdown" isOpen={showSaveDropdown}>
                                    <DropdownItem onClick={handleSaveToBoard}>
                                        <i className="fas fa-clipboard" />
                                        Save to Board
                                    </DropdownItem>
                                    <DropdownItem onClick={handleSaveToTeamBoard}>
                                        <i className="fas fa-chalkboard" />
                                        Save to Team Board
                                    </DropdownItem>
                                </SaveDropdown>
                            </div>
                            <ActionButton onClick={handleShare} title="Share article">
                                <i className="fas fa-share-alt" />
                                <span>Share</span>
                            </ActionButton>
                            <ActionButton onClick={handleOpenOriginal} title="Read original">
                                <i className="fas fa-external-link-alt" />
                                <span>Original</span>
                            </ActionButton>
                            <ActionButton onClick={handleClose} title="Close">
                                <i className="fas fa-times" />
                            </ActionButton>
                        </HeaderActions>
                    </DetailHeader>
                    <ArticleSection>
                        <ArticleTitle>{article.title}</ArticleTitle>
                        <ArticleMeta>
                            <MetaItem>
                                <i className="fas fa-newspaper" />
                                {getSourceText()}
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
                        {'hashtag' in article && article.hashtag && article.hashtag.length > 0 && (
                            <HashtagSection>
                                <HashtagList hashtags={article.hashtag} />
                            </HashtagSection>
                        )}
                        {!hasImageInContent && shouldShowFeaturedImage && imageSrc && (
                            <ArticleImage
                                src={imageSrc}
                                alt={article.title}
                                loading="eager"
                                onError={(e) => {
                                    console.error("Image failed to load:", imageSrc);
                                    e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
                                }}
                            />
                        )}
                        <ArticleContent ref={contentRef}>
                            <ArticleContentRenderer
                                article={article}
                                className="article-content"
                                featuredImage={article.image_url}
                            />
                        </ArticleContent>
                        <ButtonContainer>
                            <ReadMoreButton href={article.url} target="_blank" rel="noopener noreferrer">
                                Read Original
                                <i className="fas fa-external-link-alt" />
                            </ReadMoreButton>
                        </ButtonContainer>
                    </ArticleSection>
                </DetailContainer>
            </Overlay>
            {showShareModal && article && (
                <ShareModal article={article} onClose={() => setShowShareModal(false)} />
            )}
            {showSaveModal && article && (
                <SaveToBoardModal article={article} onClose={() => setShowSaveModal(false)} />
            )}
            {showTeamSaveModal && article && (
                <SaveToTeamBoardModal article={article} onClose={() => setShowTeamSaveModal(false)} />
            )}
        </>
    );
}; 