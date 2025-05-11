// src/components/features/article/ViewSelector/ViewSelector.tsx
import React from 'react';
import styled from 'styled-components';

const ViewSelectorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.md};
  display: inline-flex;
  padding: 4px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const ViewOption = styled.button<{ isActive: boolean }>`
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : 'transparent'};
  color: ${({ isActive, theme }) =>
    isActive ? 'white' : theme.colors.text.secondary};
  border: none;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: 6px;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.gray[100]};
    color: ${({ isActive, theme }) =>
    isActive ? 'white' : theme.colors.text.primary};
  }
  
  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.gray[700]};
    }
  }
`;

export type ViewMode = 'title-only' | 'magazine' | 'cards' | 'article';

interface ViewSelectorProps {
    activeView: ViewMode;
    onChange: (view: ViewMode) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
                                                              activeView,
                                                              onChange
                                                          }) => {
    return (
        <ViewSelectorContainer>
            <ViewOption
                isActive={activeView === 'title-only'}
                onClick={() => onChange('title-only')}
                title="Title-Only View"
            >
                <i className="fas fa-list" />
                <span className="hide-on-mobile">Title-Only</span>
            </ViewOption>

            <ViewOption
                isActive={activeView === 'magazine'}
                onClick={() => onChange('magazine')}
                title="Magazine View"
            >
                <i className="fas fa-newspaper" />
                <span className="hide-on-mobile">Magazine</span>
            </ViewOption>

            <ViewOption
                isActive={activeView === 'cards'}
                onClick={() => onChange('cards')}
                title="Cards View"
            >
                <i className="fas fa-th-large" />
                <span className="hide-on-mobile">Cards</span>
            </ViewOption>

            <ViewOption
                isActive={activeView === 'article'}
                onClick={() => onChange('article')}
                title="Article View"
            >
                <i className="fas fa-book-open" />
                <span className="hide-on-mobile">Article</span>
            </ViewOption>
        </ViewSelectorContainer>
    );
};