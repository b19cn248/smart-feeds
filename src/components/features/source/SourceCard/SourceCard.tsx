// src/components/features/source/SourceCard/SourceCard.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Source } from '../../../../types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';
import { useCategories } from '../../../../hooks';

const SourceContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const SourceHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const SourceImage = styled.div<{ hasImage: boolean }>`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme, hasImage }) => hasImage ? 'transparent' : `${theme.colors.primary.main}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    i {
        font-size: 20px;
        color: ${({ theme }) => theme.colors.primary.main};
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const SourceInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const SourceName = styled.h3`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SourceUrl = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SourceType = styled.div`
    display: inline-block;
    padding: 2px 8px;
    background-color: ${({ theme }) => `${theme.colors.primary.main}10`};
    color: ${({ theme }) => theme.colors.primary.main};
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    margin-top: 4px;
`;

// Styled components cho categories
const CategoriesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
    min-height: 20px; /* Reserve space even when empty */
`;

const CategoryTag = styled.div`
    display: inline-block;
    padding: 2px 8px;
    background-color: ${({ theme }) => `${theme.colors.success}15`};
    color: ${({ theme }) => theme.colors.success};
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    border: 1px solid ${({ theme }) => `${theme.colors.success}30`};
`;

// ✅ ADD: Loading placeholder cho categories
const CategoryPlaceholder = styled.div`
    display: inline-block;
    padding: 2px 8px;
    background-color: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[500]};
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    animation: pulse 1.5s ease-in-out infinite alternate;

    @keyframes pulse {
        0% {
            opacity: 0.6;
        }
        100% {
            opacity: 1;
        }
    }
`;

const SourceMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    padding-top: 12px;
    margin-top: 10px;
`;

const SourceStatus = styled.div<{ active: boolean }>`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
        color: ${({ active, theme }) => active ? theme.colors.success : theme.colors.error};
    }
`;

const SourceDate = styled.div``;

const SourceActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.text.primary};
    }
`;

interface SourceCardProps {
    source: Source;
    onClick?: () => void;
    onEditClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
    onAddToFolderClick?: (e: React.MouseEvent) => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({
                                                          source,
                                                          onClick,
                                                          onEditClick,
                                                          onDeleteClick,
                                                          onAddToFolderClick
                                                      }) => {
    const navigate = useNavigate();
    const { categories, isLoading: categoriesLoading } = useCategories();

    // Helper để lấy domain từ URL
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    // ✅ FIX: Helper để lấy tên categories từ IDs với robust error handling
    const getCategoryNames = (categoryIds: number[]): string[] => {
        if (!categoryIds || !Array.isArray(categoryIds)) {
            console.log('📝 No categories_ids found for source:', source.id);
            return [];
        }

        if (categoriesLoading) {
            console.log('⏳ Categories still loading...');
            return [];
        }

        const categoryNames = categoryIds
            .map(id => {
                const category = categories.find(cat => cat.id === id);
                if (!category) {
                    console.warn(`⚠️ Category with ID ${id} not found`);
                    return null;
                }
                return category.name;
            })
            .filter((name): name is string => name !== null);

        console.log(`✅ Found ${categoryNames.length} category names for source ${source.id}:`, categoryNames);
        return categoryNames;
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('🔄 Edit button clicked for source:', source.id);
        if (onEditClick) onEditClick(e);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDeleteClick) onDeleteClick(e);
    };

    const handleAddToFolderClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddToFolderClick) onAddToFolderClick(e);
    };

    const handleCardClick = () => {
        navigate(`/sources/${source.id}`);
    };

    const hasImage = !!source.image_url;

    // ✅ FIX: Lấy danh sách categories với robust handling
    const sourceCategories = getCategoryNames(source.categories_ids || []);

    // ✅ FIX: Fallback to legacy category_id if categories_ids not available
    const legacyCategoryId = source.category_id;
    const hasLegacyCategory = legacyCategoryId && typeof legacyCategoryId === 'number';

    // Nếu không có categories_ids nhưng có legacy category_id
    const legacyCategory = hasLegacyCategory
        ? categories.find(cat => cat.id === legacyCategoryId)?.name
        : null;

    const displayCategories = sourceCategories.length > 0
        ? sourceCategories
        : (legacyCategory ? [legacyCategory] : []);

    console.log('🔍 Source card rendering:', {
        sourceId: source.id,
        categories_ids: source.categories_ids,
        category_id: source.category_id,
        displayCategories,
        categoriesLoading
    });

    return (
        <Card onClick={handleCardClick}>
            <SourceContent>
                <SourceHeader>
                    <SourceImage hasImage={hasImage}>
                        {hasImage ? (
                            <img src={source.image_url} alt={source.name} />
                        ) : (
                            <i className="fas fa-rss" />
                        )}
                    </SourceImage>
                    <SourceInfo>
                        <SourceName title={source.name}>{source.name}</SourceName>
                        <SourceUrl title={source.url}>{getDomain(source.url)}</SourceUrl>
                        <SourceType>{source.type}</SourceType>
                    </SourceInfo>
                </SourceHeader>

                {/* ✅ FIX: Hiển thị categories với better handling */}
                <CategoriesContainer>
                    {categoriesLoading ? (
                        // Show loading placeholders
                        <>
                            <CategoryPlaceholder>Loading...</CategoryPlaceholder>
                        </>
                    ) : displayCategories.length > 0 ? (
                        // Show actual categories
                        displayCategories.map((categoryName, index) => (
                            <CategoryTag key={index} title={categoryName}>
                                {categoryName}
                            </CategoryTag>
                        ))
                    ) : (
                        // Show fallback if no categories
                        <CategoryTag style={{
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            border: '1px solid #d1d5db'
                        }}>
                            No categories
                        </CategoryTag>
                    )}
                </CategoriesContainer>

                <SourceMeta>
                    <SourceStatus active={source.active}>
                        <i className={`fas fa-${source.active ? 'circle-check' : 'circle-xmark'}`} />
                        {source.active ? 'Active' : 'Inactive'}
                    </SourceStatus>
                    <SourceDate>{formatDate(new Date(source.created_at))}</SourceDate>
                </SourceMeta>

                <SourceActions>
                    <ActionButton onClick={handleEditClick} title="Edit source">
                        <i className="fas fa-edit" />
                    </ActionButton>
                    <ActionButton onClick={handleDeleteClick} title="Delete source">
                        <i className="fas fa-trash" />
                    </ActionButton>
                    <ActionButton onClick={handleAddToFolderClick} title="Add to folder">
                        <i className="fas fa-folder-plus" />
                    </ActionButton>
                </SourceActions>
            </SourceContent>
        </Card>
    );
};