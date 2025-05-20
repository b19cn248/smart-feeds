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
    hashtags: string[];
    limit?: number;
    compact?: boolean;
    onClick?: (e: React.MouseEvent, hashtag: string) => void;
}

export const HashtagList: React.FC<HashtagListProps> = ({
    hashtags,
    limit,
    compact = false,
    onClick
}) => {
    const displayTags = limit ? hashtags.slice(0, limit) : hashtags;

    return (
        <HashtagContainer compact={compact}>
            {displayTags.map((tag, index) => (
                <HashtagBadge
                    key={index}
                    compact={compact}
                    onClick={(e) => onClick && onClick(e, tag)}
                >
                    <i className="fas fa-hashtag" />{tag}
                </HashtagBadge>
            ))}
            {limit && hashtags.length > limit && (
                <HashtagBadge compact={compact}>
                    +{hashtags.length - limit} more
                </HashtagBadge>
            )}
        </HashtagContainer>
    );
};