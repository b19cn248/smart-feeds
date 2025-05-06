// src/components/features/folder/FolderCard/FolderCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Folder } from '../../../../types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';
import { iconButton, badge } from '../../../../styles/mixins';
import { css } from 'styled-components';

const ColorStrip = styled.div<{ color: string }>`
    height: 8px;
    background-color: ${props => props.color};
    margin: -20px -20px 16px -20px;
    border-radius: ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg} 0 0;
`;

const FolderHeader = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
`;

const FolderIcon = styled.div<{ color: string }>`
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${props => `${props.color}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;

    i {
        font-size: 18px;
        color: ${props => props.color};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 36px;
        height: 36px;
    }
`;

const FolderInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const FolderName = styled.h3`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const FolderMeta = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ActiveBadge = styled.span`
    ${badge}
    ${({ theme }) => css`
        background-color: ${theme.colors.primary.light};
        color: ${theme.colors.primary.main};
    `}
`;

const FolderThemeBadge = styled.span`
    ${badge}
    ${({ theme }) => css`
        background-color: ${theme.colors.gray[100]};
        color: ${theme.colors.gray[600]};

        @media (prefers-color-scheme: dark) {
            background-color: ${theme.colors.gray[800]};
            color: ${theme.colors.gray[400]};
        }
    `}
`;

const FolderActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    margin-top: 16px;

    @media (prefers-color-scheme: dark) {
        border-top-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const FolderSources = styled.div`
    display: flex;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};

    i {
        margin-right: 4px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const FolderMenu = styled.button`
    ${iconButton}
`;

interface FolderCardProps {
    folder: Folder;
    onClick?: () => void;
    onMenuClick?: (e: React.MouseEvent) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
                                                          folder,
                                                          onClick,
                                                          onMenuClick
                                                      }) => {
    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onMenuClick?.(e);
    };

    return (
        <Card onClick={onClick} padding="0">
            <div style={{ padding: '20px' }}>
                <ColorStrip color={folder.color} />
                <FolderHeader>
                    <FolderIcon color={folder.color}>
                        <i className="fas fa-folder" />
                    </FolderIcon>
                    <FolderInfo>
                        <FolderName>{folder.name}</FolderName>
                        <FolderMeta>
                            <span>Created {formatDate(folder.lastUpdated)}</span>
                            {folder.theme && (
                                <FolderThemeBadge>
                                    {folder.theme}
                                </FolderThemeBadge>
                            )}
                            {folder.isActive && <ActiveBadge>Active</ActiveBadge>}
                        </FolderMeta>
                    </FolderInfo>
                </FolderHeader>
                <FolderActions>
                    <FolderSources>
                        <i className="fas fa-rss" />
                        {folder.sourcesCount} {folder.sourcesCount === 1 ? 'source' : 'sources'}
                    </FolderSources>
                    <FolderMenu onClick={handleMenuClick} aria-label="Folder options">
                        <i className="fas fa-ellipsis-v" />
                    </FolderMenu>
                </FolderActions>
            </div>
        </Card>
    );
};