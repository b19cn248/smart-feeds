// src/components/features/article/SourceNavigator/SourceNavigator.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArticleGroup } from '../../../../types';

const NavigatorContainer = styled.div`
    position: sticky;
    top: 80px;
    margin-bottom: 24px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.lg};
    padding: 16px;
    box-shadow: ${({ theme }) => theme.shadows.md};
    z-index: 10;
    
    @media (prefers-color-scheme: dark) {
        background-color: ${({ theme }) => theme.colors.gray[800]};
        border-color: ${({ theme }) => theme.colors.gray[700]};
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        padding: 12px;
    }
`;

const Title = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    
    i {
        margin-right: 8px;
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const SourceList = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    max-height: 100px;
    overflow-y: auto;
    padding-right: 8px;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.gray[100]};
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.gray[400]};
        border-radius: 4px;
    }
    
    @media (prefers-color-scheme: dark) {
        &::-webkit-scrollbar-track {
            background: ${({ theme }) => theme.colors.gray[700]};
        }
        
        &::-webkit-scrollbar-thumb {
            background: ${({ theme }) => theme.colors.gray[500]};
        }
    }
`;

const SourceButton = styled.button<{ isActive: boolean }>`
    padding: 6px 12px;
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.gray[100]};
    color: ${({ isActive, theme }) =>
    isActive ? 'white' : theme.colors.text.primary};
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    
    &:hover {
        background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.hover : theme.colors.gray[200]};
    }
    
    @media (prefers-color-scheme: dark) {
        background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.gray[700]};
        color: ${({ isActive, theme }) =>
    isActive ? 'white' : theme.colors.text.secondary};
            
        &:hover {
            background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.hover : theme.colors.gray[600]};
        }
    }
`;

interface SourceNavigatorProps {
    groups: ArticleGroup[];
    onSourceClick: (sourceId: number) => void;
}

export const SourceNavigator: React.FC<SourceNavigatorProps> = ({
                                                                    groups,
                                                                    onSourceClick
                                                                }) => {
    const [activeSource, setActiveSource] = useState<number | null>(null);

    // Set first source as active by default
    useEffect(() => {
        if (groups.length > 0 && !activeSource) {
            setActiveSource(groups[0].source.id);
        }
    }, [groups, activeSource]);

    // Helper để lấy domain từ URL
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    const handleSourceClick = (sourceId: number) => {
        setActiveSource(sourceId);
        onSourceClick(sourceId);
    };

    if (groups.length <= 1) return null;

    return (
        <NavigatorContainer>
            <Title>
                <i className="fas fa-compass" />
                Jump to Source
            </Title>
            <SourceList>
                {groups.map(group => (
                    <SourceButton
                        key={`nav-${group.source.id}`}
                        isActive={activeSource === group.source.id}
                        onClick={() => handleSourceClick(group.source.id)}
                    >
                        {getDomain(group.source.url)}
                        <span style={{ marginLeft: '4px' }}>({group.articles.length})</span>
                    </SourceButton>
                ))}
            </SourceList>
        </NavigatorContainer>
    );
};