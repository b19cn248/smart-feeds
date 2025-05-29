// src/components/features/article/CategoryExploreSection/CategoryExploreSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Article, Category } from '../../../../types';
import { categoryService } from '../../../../services/categoryService';
import { useToast } from '../../../../contexts/ToastContext';
import { MagazineView } from '../ViewModes';
import { Button } from '../../../common/Button';
import { LoadingScreen } from '../../../common/LoadingScreen';

const SectionContainer = styled.div`
  margin-bottom: 48px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

// Thay đổi từ container dạng scroll sang grid layout
const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr; // Chuyển sang 1 cột trên mobile
  }
`;

// Định nghĩa các màu theo category
const getCategoryColor = (categoryId: number): string => {
    const colorMap: Record<number, string> = {
        1: '#3B82F6', // Current Affairs - Blue
        2: '#10B981', // Economics - Green
        3: '#8B5CF6', // Education - Purple
        4: '#3B82F6', // Technology - Blue
        5: '#EC4899', // Entertainment - Pink
        6: '#F43F5E', // Sports - Red
        7: '#06B6D4', // Health - Cyan
        8: '#F59E0B', // Lifestyle - Amber
        9: '#6366F1', // Travel - Indigo
        10: '#475569', // Legal - Slate
        11: '#22C55E', // Science & Environment - Green
        12: '#EF4444', // Automotive - Red
        13: '#8B5CF6', // Opinion - Purple
    };

    return colorMap[categoryId] || '#64748B'; // Default gray
};

// Thêm icon cho mỗi category
const getCategoryIcon = (categoryId: number): string => {
    const iconMap: Record<number, string> = {
        1: 'newspaper',
        2: 'chart-line',
        3: 'graduation-cap',
        4: 'microchip',
        5: 'film',
        6: 'futbol',
        7: 'heartbeat',
        8: 'home',
        9: 'plane',
        10: 'gavel',
        11: 'flask',
        12: 'car',
        13: 'comment',
    };

    return iconMap[categoryId] || 'folder';
};

// Cải thiện card design
const CategoryCard = styled.div<{ isActive: boolean; color: string }>`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ isActive, color }) => isActive ? color : 'transparent'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${({ color }) => color};
    opacity: ${({ isActive }) => isActive ? 1 : 0.3};
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CategoryIconWrapper = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ color }) => `${color}15`}; // Transparent version of color
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const CategoryName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.3;
`;

const CategoryDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin-top: 4px;
`;

const ArticlesSectionTitle = styled.h3<{ color: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ color }) => color};
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid ${({ color }) => `${color}30`};
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    color: ${({ color }) => color};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 16px 0;
`;

// Thêm component này để thể hiện đang scroll đến section hiển thị bài viết
const ArticlesSectionAnchor = styled.div`
  scroll-margin-top: 80px;
`;

interface CategoryExploreSectionProps {
    onArticleClick: (article: Article) => void;
    onSaveArticle?: (article: Article) => void;
}

export const CategoryExploreSection: React.FC<CategoryExploreSectionProps> = ({
                                                                                  onArticleClick,
                                                                                  onSaveArticle
                                                                              }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingArticles, setIsLoadingArticles] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();
    const articlesSectionRef = useRef<HTMLDivElement>(null);

    // Fetch categories khi component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch articles khi selected category thay đổi
    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryArticles(selectedCategory.id);
        }
    }, [selectedCategory]);

    // Scroll đến phần articles khi chọn category
    useEffect(() => {
        if (selectedCategory && articlesSectionRef.current) {
            articlesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [articles, selectedCategory]);

    // Fetch danh sách categories
    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            setError(null);
            const response = await categoryService.getCategories();
            setCategories(response.data);

            // Auto-select category đầu tiên nếu có
            if (response.data && response.data.length > 0 && !selectedCategory) {
                setSelectedCategory(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please try again.');
            showToast('error', 'Error', 'Failed to load categories.');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // Fetch articles theo categoryId
    const fetchCategoryArticles = async (categoryId: number) => {
        try {
            setIsLoadingArticles(true);
            setError(null);
            const response = await categoryService.getCategoryArticles(categoryId);
            setArticles(response.data.content);
        } catch (error) {
            console.error('Error fetching category articles:', error);
            setError('Failed to load articles for this category. Please try again.');
            showToast('error', 'Error', 'Failed to load category articles.');
        } finally {
            setIsLoadingArticles(false);
        }
    };

    // Handle category click
    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
    };

    // Handle refresh
    const handleRefresh = () => {
        if (selectedCategory) {
            fetchCategoryArticles(selectedCategory.id);
        } else {
            fetchCategories();
        }
    };

    // Track view khi article được click
    const handleArticleClick = (article: Article) => {
        // Gọi callback từ props
        onArticleClick(article);
    };

    if (isLoadingCategories) {
        return <LoadingScreen />;
    }

    if (error && !selectedCategory) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>
                        <i className="fas fa-compass" />
                        Explore by Category
                    </SectionTitle>
                    <Button leftIcon="sync" onClick={fetchCategories} size="sm">
                        Retry
                    </Button>
                </SectionHeader>
                <EmptyState>
                    <EmptyStateIcon>
                        <i className="fas fa-exclamation-circle" />
                    </EmptyStateIcon>
                    <EmptyStateText>{error}</EmptyStateText>
                    <Button onClick={fetchCategories} leftIcon="sync">
                        Try Again
                    </Button>
                </EmptyState>
            </SectionContainer>
        );
    }

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>
                    <i className="fas fa-compass" />
                    Explore by Category
                </SectionTitle>
                <Button leftIcon="sync" onClick={handleRefresh} size="sm" variant="ghost">
                    Refresh
                </Button>
            </SectionHeader>

            {/* Categories grid layout */}
            <CategoriesGrid>
                {categories.map(category => {
                    const color = getCategoryColor(category.id);
                    const icon = getCategoryIcon(category.id);

                    return (
                        <CategoryCard
                            key={category.id}
                            isActive={selectedCategory?.id === category.id}
                            color={color}
                            onClick={() => handleCategoryClick(category)}
                            aria-label={`View articles from ${category.name} category`}
                        >
                            <CategoryHeader>
                                <CategoryIconWrapper color={color}>
                                    <i className={`fas fa-${icon}`} />
                                </CategoryIconWrapper>
                                <CategoryName>{category.name}</CategoryName>
                            </CategoryHeader>
                            <CategoryDescription>{category.description}</CategoryDescription>
                        </CategoryCard>
                    );
                })}
            </CategoriesGrid>

            {/* Articles display section */}
            {selectedCategory && (
                <ArticlesSectionAnchor ref={articlesSectionRef}>
                    <ArticlesSectionTitle color={getCategoryColor(selectedCategory.id)}>
                        <i className={`fas fa-${getCategoryIcon(selectedCategory.id)}`} />
                        {selectedCategory.name} Articles
                    </ArticlesSectionTitle>

                    {isLoadingArticles ? (
                        <LoadingScreen />
                    ) : error ? (
                        <EmptyState>
                            <EmptyStateIcon>
                                <i className="fas fa-exclamation-circle" />
                            </EmptyStateIcon>
                            <EmptyStateText>{error}</EmptyStateText>
                            <Button
                                onClick={() => fetchCategoryArticles(selectedCategory.id)}
                                leftIcon="sync"
                            >
                                Try Again
                            </Button>
                        </EmptyState>
                    ) : articles.length > 0 ? (
                        <MagazineView
                            articles={articles}
                            onArticleClick={handleArticleClick}
                            onSaveArticle={onSaveArticle}
                        />
                    ) : (
                        <EmptyState>
                            <EmptyStateIcon>
                                <i className="fas fa-inbox" />
                            </EmptyStateIcon>
                            <EmptyStateText>
                                No articles available in the {selectedCategory.name} category.
                            </EmptyStateText>
                            <Button
                                onClick={() => fetchCategoryArticles(selectedCategory.id)}
                                leftIcon="sync"
                                variant="secondary"
                            >
                                Refresh
                            </Button>
                        </EmptyState>
                    )}
                </ArticlesSectionAnchor>
            )}
        </SectionContainer>
    );
};