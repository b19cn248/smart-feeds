// src/components/features/article/FolderArticlesSection/FolderArticlesSection.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FolderWithArticles, FolderArticle, FolderDetailWithArticles } from '../../../../types/folderArticles.types';
import { ArticleCard } from '../ArticleCard';
import { Button } from '../../../common/Button';
import { formatDate } from '../../../../utils';
import { folderArticlesService } from '../../../../services/folderArticlesService';
import { useToast } from '../../../../contexts/ToastContext';

const SectionContainer = styled.div`
    margin-bottom: 32px;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[700]};
    }
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

    @media (prefers-color-scheme: dark) {
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
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

    @media (prefers-color-scheme: dark) {
        background-color: ${({ theme }) => theme.colors.gray[800]};
    }
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

    /* Đảm bảo các hàng có chiều cao đồng đều */
    grid-auto-rows: 1fr;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
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

const LoadingIndicator = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    
    i {
        margin-right: 8px;
        animation: spin 1s linear infinite;
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    }
`;

// Helper to get color from theme
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

interface FolderArticlesSectionProps {
    folder: FolderWithArticles;
    onArticleClick: (article: FolderArticle) => void;
    isInitiallyExpanded?: boolean;
    id: string;
}

export const FolderArticlesSection: React.FC<FolderArticlesSectionProps> = ({
                                                                                folder,
                                                                                onArticleClick,
                                                                                isInitiallyExpanded = false,
                                                                                id
                                                                            }) => {
    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
    const [articles, setArticles] = useState<FolderArticle[]>(folder.articles);
    const [isLoading, setIsLoading] = useState(false);
    const [containerHeight, setContainerHeight] = useState('1000px');
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Update height when expanded/collapsed
    useEffect(() => {
        if (containerRef.current && isExpanded) {
            setContainerHeight(`${containerRef.current.scrollHeight}px`);
        }
    }, [isExpanded, articles]);

    const toggleExpand = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.view-all-button')) {
            return;
        }
        setIsExpanded(!isExpanded);
    };

    // Cập nhật hàm handleViewAllClick trong file FolderArticlesSection.tsx
    const handleViewAllClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn không cho sự kiện lan tỏa đến toggleExpand

        // Sử dụng state trong navigate để truyền chế độ xem
        navigate(`/folder/${folder.id}`, {
            state: { viewMode: 'cards' }
        });
    };

    // Hàm xử lý ref để khắc phục lỗi TypeScript
    const setContainerRef = (element: HTMLDivElement | null) => {
        containerRef.current = element;
    };

    const color = getColorFromTheme(folder.theme);

    return (
        <SectionContainer id={id}>
            <SectionHeader onClick={toggleExpand}>
                <TitleContainer>
                    <FolderIcon color={color}>
                        <i className="fas fa-folder" />
                    </FolderIcon>
                    <SectionTitle>{folder.name}</SectionTitle>
                </TitleContainer>
                <HeaderActions>
                    <ViewAllButton
                        variant="secondary"
                        onClick={handleViewAllClick}
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
                maxHeight={containerHeight}
                ref={setContainerRef}
            >
                <ArticlesGrid>
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onClick={() => onArticleClick(article)}
                            lazyLoad={true}
                        />
                    ))}
                </ArticlesGrid>

                {isLoading && (
                    <LoadingIndicator>
                        <i className="fas fa-circle-notch" />
                        Loading more articles...
                    </LoadingIndicator>
                )}
            </ArticlesContainer>
        </SectionContainer>
    );
};