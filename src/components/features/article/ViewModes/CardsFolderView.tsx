// src/components/features/article/ViewModes/CardsFolderView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FolderWithArticles, FolderArticle } from '../../../../types/folderArticles.types';
import { ArticleCard } from '../ArticleCard';
import { Button } from '../../../common/Button';

const SectionContainer = styled.div`
    margin-bottom: 32px;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
`;

const FolderIcon = styled.div<{ color: string }>`
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${props => `${props.color}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    i {
        font-size: 16px;
        color: ${props => props.color};
    }
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
`;

const ArticleCount = styled.span`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    background-color: ${({ theme }) => theme.colors.gray[100]};
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: 8px;
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 10px;
`;

const ViewAllButton = styled(Button)`
    padding: 6px 12px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ToggleIcon = styled.div<{ isExpanded: boolean }>`
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: transform 0.3s;
    transform: ${({ isExpanded }) => isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ArticlesContainer = styled.div<{ isExpanded: boolean, maxHeight: string }>`
    max-height: ${({ isExpanded, maxHeight }) => isExpanded ? maxHeight : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
`;

const ArticlesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    padding: 20px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const ShowMoreButton = styled.div`
    display: flex;
    justify-content: center;
    padding: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    width: 100%;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        padding: 12px 8px;
    }

    button {
        @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
            width: 100%;
            font-size: ${({ theme }) => theme.typography.fontSize.sm};
        }
    }
`;

// Số bài viết hiển thị ban đầu
const INITIAL_ARTICLE_COUNT = 3;

// Helper để lấy màu từ theme
const getColorFromTheme = (theme: string): string => {
    const themeToColorMap: Record<string, string> = {
        'blue': '#2E7CF6',
        'red': '#F43F5E',
        'green': '#10B981',
        'yellow': '#FBBF24',
        'purple': '#8B5CF6',
        'pink': '#EC4899',
        'default': '#64748B',
        'tech': '#2E7CF6',
        'sport': '#F43F5E',
        'news': '#10B981',
        'finance': '#FBBF24',
        'entertainment': '#8B5CF6',
        'health': '#EC4899',
    };

    return themeToColorMap[theme] || themeToColorMap.default;
};

interface CardsFolderViewProps {
    folders: FolderWithArticles[];
    onArticleClick: (article: FolderArticle) => void;
    onSaveArticle?: (article: FolderArticle) => void;
    onHashtagClick?: (hashtag: string) => void;
}

export const CardsFolderView: React.FC<CardsFolderViewProps> = ({
    folders,
    onArticleClick,
    onSaveArticle,
    onHashtagClick
}) => {
    // Tạo state để theo dõi trạng thái mở rộng của từng folder
    const [expandedState, setExpandedState] = useState<Record<number, boolean>>({});
    // Tạo state để theo dõi số lượng bài viết hiển thị cho từng folder
    const [visibleArticlesCount, setVisibleArticlesCount] = useState<Record<number, number>>({});
    // Refs để theo dõi các phần tử container
    const containerRefs = useRef<Record<number, HTMLDivElement | null>>({});
    // State để theo dõi chiều cao container
    const [containerHeights, setContainerHeights] = useState<Record<number, string>>({});
    const navigate = useNavigate();

    // Khởi tạo trạng thái mặc định - mở rộng 3 folder đầu tiên, hiển thị số bài viết ban đầu
    useEffect(() => {
        const initialExpandedState: Record<number, boolean> = {};
        const initialVisibleCount: Record<number, number> = {};

        folders.forEach((folder, index) => {
            initialExpandedState[folder.id] = index < 3;
            initialVisibleCount[folder.id] = INITIAL_ARTICLE_COUNT;
        });

        setExpandedState(initialExpandedState);
        setVisibleArticlesCount(initialVisibleCount);
    }, [folders]);

    // Cập nhật chiều cao container khi trạng thái mở rộng hoặc số bài viết hiển thị thay đổi
    useEffect(() => {
        // Cập nhật chiều cao sau khi DOM đã cập nhật
        const updateHeights = () => {
            folders.forEach(folder => {
                const ref = containerRefs.current[folder.id];
                if (ref && expandedState[folder.id]) {
                    setContainerHeights(prev => ({
                        ...prev,
                        [folder.id]: `${ref.scrollHeight}px`
                    }));
                }
            });
        };

        // Sử dụng setTimeout để đảm bảo DOM đã cập nhật
        const timerId = setTimeout(updateHeights, 10);
        return () => clearTimeout(timerId);
    }, [expandedState, visibleArticlesCount, folders]);

    const toggleFolder = (folderId: number) => {
        setExpandedState(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    const showMoreArticles = (folderId: number) => {
        setVisibleArticlesCount(prev => ({
            ...prev,
            [folderId]: (prev[folderId] || INITIAL_ARTICLE_COUNT) + INITIAL_ARTICLE_COUNT
        }));
    };

    const handleViewAllClick = (e: React.MouseEvent, folderId: number) => {
        e.stopPropagation(); // Ngăn không cho sự kiện lan tỏa đến toggleExpand
        navigate(`/folder/${folderId}`, {
            state: { viewMode: 'cards' }
        });
    };

    const setContainerRef = (element: HTMLDivElement | null, folderId: number) => {
        containerRefs.current[folderId] = element;
    };

    return (
        <div>
            {folders.map(folder => {
                const isExpanded = !!expandedState[folder.id];
                const visibleCount = visibleArticlesCount[folder.id] || INITIAL_ARTICLE_COUNT;
                const hasMoreArticles = folder.articles.length > visibleCount;
                const articlesToShow = folder.articles.slice(0, visibleCount);

                return (
                    <SectionContainer key={`folder-cards-${folder.id}`}>
                        <SectionHeader onClick={() => toggleFolder(folder.id)}>
                            <TitleContainer>
                                <FolderIcon color={getColorFromTheme(folder.theme)}>
                                    <i className="fas fa-folder" />
                                </FolderIcon>
                                <SectionTitle>{folder.name}</SectionTitle>
                                <ArticleCount>{folder.articles.length}</ArticleCount>
                            </TitleContainer>
                            <HeaderActions>
                                <ViewAllButton
                                    variant="secondary"
                                    onClick={(e) => handleViewAllClick(e, folder.id)}
                                    className="view-all-button"
                                    leftIcon="list"
                                >
                                    Xem tất cả
                                </ViewAllButton>
                                <ToggleIcon isExpanded={isExpanded}>
                                    <i className="fas fa-chevron-down" />
                                </ToggleIcon>
                            </HeaderActions>
                        </SectionHeader>

                        <ArticlesContainer
                            isExpanded={isExpanded}
                            maxHeight={containerHeights[folder.id] || '1000px'}
                            ref={(el) => setContainerRef(el, folder.id)}
                        >
                            <ArticlesGrid>
                                {articlesToShow.map((article) => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                        onClick={() => onArticleClick(article)}
                                        onHashtagClick={onHashtagClick}
                                        lazyLoad={true}
                                    />
                                ))}
                            </ArticlesGrid>

                            {hasMoreArticles && isExpanded && (
                                <ShowMoreButton>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showMoreArticles(folder.id);
                                        }}
                                        variant="secondary"
                                    >
                                        Show More ({folder.articles.length - visibleCount} remaining)
                                    </Button>
                                </ShowMoreButton>
                            )}
                        </ArticlesContainer>
                    </SectionContainer>
                );
            })}
        </div>
    );
};