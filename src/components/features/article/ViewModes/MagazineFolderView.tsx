// src/components/features/article/ViewModes/MagazineFolderView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FolderWithArticles, FolderArticle } from '../../../../types/folderArticles.types';
import { formatDate, truncateText } from '../../../../utils';
import { Button } from '../../../common/Button';
import { HashtagList } from '../HashtagList';

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

// Sử dụng lại các styles từ MagazineView
const MagazineList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
`;

const MagazineItem = styled.div`
    display: flex;
    padding: 16px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background-color: ${({ theme }) => theme.colors.background.secondary};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    box-shadow: ${({ theme }) => theme.shadows.sm};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }

`;

const ArticleImage = styled.div<{ imageUrl: string }>`
    width: 240px;
    height: 160px;
    flex-shrink: 0;
    border-radius: ${({ theme }) => theme.radii.md};
    background-image: url(${props => props.imageUrl});
    background-size: cover;
    background-position: center;
    margin-right: 24px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        height: 180px;
        margin-right: 0;
        margin-bottom: 16px;
    }
`;

const ArticleContent = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
`;

const Excerpt = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0 0 16px 0;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
`;

const HashtagContainer = styled.div`
    margin-top: 12px;
    margin-bottom: 8px;
    flex-grow: 0;
`;

const Meta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const SourceInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const SourceName = styled.span`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const DateText = styled.span`
    display: flex;
    align-items: center;

    &:before {
        content: '•';
        margin: 0 6px;
    }

    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.gray[500]};
    padding: 4px 8px;
    font-size: 14px;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.radii.sm};

    &:hover {
        color: ${({ theme }) => theme.colors.primary.main};
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }
`;

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

// Extract text from HTML content - sao chép từ component hiện tại
const extractTextFromHtml = (html: string): string => {
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    } catch (error) {
        console.error('Error parsing HTML content:', error);
        return html;
    }
};

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

interface MagazineFolderViewProps {
    folders: FolderWithArticles[];
    onArticleClick: (article: FolderArticle) => void;
    onSaveArticle?: (article: FolderArticle) => void;
}

export const MagazineFolderView: React.FC<MagazineFolderViewProps> = ({
                                                                          folders,
                                                                          onArticleClick,
                                                                          onSaveArticle
                                                                      }) => {
    // Tạo một object state để theo dõi trạng thái mở/đóng của từng folder
    const [expandedState, setExpandedState] = useState<Record<number, boolean>>({});
    const containerRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const [containerHeights, setContainerHeights] = useState<Record<number, string>>({});
    const navigate = useNavigate();

    // Khởi tạo trạng thái mặc định - mở rộng 3 folder đầu tiên, các folder còn lại thu gọn
    useEffect(() => {
        const initialState: Record<number, boolean> = {};
        folders.forEach((folder, index) => {
            initialState[folder.id] = index < 3;
        });
        setExpandedState(initialState);
    }, [folders]);

    // Cập nhật chiều cao khi mở rộng/thu gọn
    useEffect(() => {
        const updatedHeights: Record<number, string> = { ...containerHeights };

        folders.forEach(folder => {
            const ref = containerRefs.current[folder.id];
            if (ref && expandedState[folder.id]) {
                updatedHeights[folder.id] = `${ref.scrollHeight}px`;
            }
        });

        setContainerHeights(updatedHeights);
    }, [expandedState, folders]);

    const toggleFolder = (folderId: number) => {
        setExpandedState(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    const handleViewAllClick = (e: React.MouseEvent, folderId: number) => {
        e.stopPropagation(); // Ngăn không cho sự kiện lan tỏa đến toggleExpand

        // Sử dụng state trong navigate để truyền chế độ xem
        navigate(`/folder/${folderId}`, {
            state: { viewMode: 'magazine' }
        });
    };

    // Hàm xử lý ref để khắc phục lỗi TypeScript
    const setContainerRef = (element: HTMLDivElement | null, folderId: number) => {
        containerRefs.current[folderId] = element;
    };

    return (
        <div>
            {folders.map(folder => (
                <SectionContainer key={`folder-magazine-${folder.id}`}>
                    <SectionHeader onClick={() => toggleFolder(folder.id)}>
                        <TitleContainer>
                            <FolderIcon color={getColorFromTheme(folder.theme)}>
                                <i className="fas fa-folder" />
                            </FolderIcon>
                            <SectionTitle>{folder.name}</SectionTitle>
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
                            <ToggleIcon isExpanded={!!expandedState[folder.id]}>
                                <i className="fas fa-chevron-down" />
                            </ToggleIcon>
                        </HeaderActions>
                    </SectionHeader>

                    <ArticlesContainer
                        isExpanded={!!expandedState[folder.id]}
                        maxHeight={containerHeights[folder.id] || '1000px'}
                        ref={(el) => setContainerRef(el, folder.id)}
                    >
                        <MagazineList>
                            {folder.articles.map(article => {
                                const excerptText = truncateText(extractTextFromHtml(article.content), 220);

                                return (
                                    <MagazineItem key={article.id} onClick={() => onArticleClick(article)}>
                                        {article.image_url && (
                                            <ArticleImage imageUrl={article.image_url || DEFAULT_ARTICLE_IMAGE} />
                                        )}
                                        <ArticleContent>
                                            <Title>{article.title}</Title>
                                            <Excerpt>{excerptText}</Excerpt>

                                            {/* Hiển thị hashtags */}
                                            {article.hashtag && article.hashtag.length > 0 && (
                                                <HashtagContainer>
                                                    <HashtagList
                                                        hashtags={article.hashtag}
                                                        limit={4}
                                                        compact={true}
                                                    />
                                                </HashtagContainer>
                                            )}

                                            <Meta>
                                                <SourceInfo>
                                                    <SourceName>
                                                        <i className="fas fa-newspaper" />
                                                        {typeof article.source === 'string' ? article.source : 'Unknown source'}
                                                    </SourceName>
                                                    <DateText>
                                                        <i className="fas fa-calendar" />
                                                        {formatDate(new Date(article.publish_date))}
                                                    </DateText>
                                                </SourceInfo>
                                                <ActionButtons>
                                                    {onSaveArticle && (
                                                        <ActionButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onSaveArticle(article);
                                                            }}
                                                            title="Save to board"
                                                        >
                                                            <i className="fas fa-bookmark" />
                                                        </ActionButton>
                                                    )}
                                                    <ActionButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(article.url, '_blank');
                                                        }}
                                                        title="Open original"
                                                    >
                                                        <i className="fas fa-external-link-alt" />
                                                    </ActionButton>
                                                </ActionButtons>
                                            </Meta>
                                        </ArticleContent>
                                    </MagazineItem>
                                );
                            })}
                        </MagazineList>
                    </ArticlesContainer>
                </SectionContainer>
            ))}
        </div>
    );
};