// src/components/features/article/HashtagList/HashtagList.tsx
import React from 'react';
import styled from 'styled-components';

const HashtagContainer = styled.div<{ compact?: boolean }>`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ compact }) => (compact ? '4px' : '6px')};
    margin-top: ${({ compact }) => (compact ? '8px' : '12px')};
`;

const HashtagBadge = styled.span<{ compact?: boolean }>`
    display: inline-flex;
    align-items: center;
    background-color: ${({ theme }) => `${theme.colors.primary.light}30`};
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: ${({ theme, compact }) =>
    compact ? theme.typography.fontSize.xs : theme.typography.fontSize.sm};
    padding: ${({ compact }) => (compact ? '2px 6px' : '3px 8px')};
    border-radius: ${({ theme }) => theme.radii.full};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    transition: ${({ theme }) => theme.transitions.default};
    cursor: pointer;
    
    &:hover {
        background-color: ${({ theme }) => `${theme.colors.primary.main}30`};
    }
    
    i {
        margin-right: 4px;
        font-size: ${({ theme, compact }) =>
    compact ? theme.typography.fontSize.xs : theme.typography.fontSize.sm};
    }
`;

interface HashtagListProps {
    hashtags?: string[];
    limit?: number;
    compact?: boolean;
    onClick?: (tag: string) => void;
}

export const HashtagList: React.FC<HashtagListProps> = ({
                                                            hashtags = [],
                                                            limit,
                                                            compact = false,
                                                            onClick
                                                        }) => {
    if (!hashtags || hashtags.length === 0) return null;

    // Giới hạn số lượng hashtag hiển thị nếu cần
    const displayedHashtags = limit ? hashtags.slice(0, limit) : hashtags;
    const hasMore = limit && hashtags.length > limit;

    const handleClick = (tag: string) => {
        if (onClick) {
            onClick(tag);
        }
    };

    return (
        <HashtagContainer compact={compact}>
            {displayedHashtags.map((tag, index) => (
                <HashtagBadge
                    key={`${tag}-${index}`}
                    compact={compact}
                    onClick={() => handleClick(tag)}
                >
                    <i className="fas fa-hashtag" />{tag}
                </HashtagBadge>
            ))}
            {hasMore && (
                <HashtagBadge compact={compact}>
                    +{hashtags.length - limit} more
                </HashtagBadge>
            )}
        </HashtagContainer>
    );
};