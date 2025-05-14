// src/components/features/folder/FolderList/EmptyState.tsx
import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/Button';
import { Card } from '../../../common/Card';

const EmptyStateWrapper = styled(Card)`
  max-width: 480px;
  margin: 48px auto;
  text-align: center;
  border-style: dashed;
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 32px;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyStateDesc = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 24px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
`;

interface EmptyStateProps {
    searchQuery?: string;
    onCreateClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                          searchQuery,
                                                          onCreateClick
                                                      }) => {
    const hasSearch = Boolean(searchQuery?.trim());

    return (
        <EmptyStateWrapper>
            <EmptyStateIcon>
                <i className="fas fa-folder-open" />
            </EmptyStateIcon>
            <EmptyStateTitle>
                {hasSearch ? 'No matching folders found' : 'No folders yet'}
            </EmptyStateTitle>
            <EmptyStateDesc>
                {hasSearch
                    ? 'Try adjusting your search query or view filter.'
                    : 'Create folders to organize your feeds and make your reading experience more enjoyable.'
                }
            </EmptyStateDesc>
            {!hasSearch && onCreateClick && (
                <Button onClick={onCreateClick} leftIcon="plus">
                    Add Folder
                </Button>
            )}
        </EmptyStateWrapper>
    );
};
