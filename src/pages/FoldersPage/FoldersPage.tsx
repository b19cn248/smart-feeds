// src/pages/FoldersPage/FoldersPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FolderList } from '../../components/features/folder/FolderList';
import { FolderModal } from '../../components/features/folder/FolderModal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useFolders, useDebounce } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import { VIEW_TYPES } from '../../constants';
import { ViewType, FolderFormData } from '../../types';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;

  i {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  max-width: 240px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
  }
`;

const ViewOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const ViewTabs = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 20px;
  padding: 4px;

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const ViewTab = styled.button<{ isActive?: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.background.secondary : 'transparent'};
  box-shadow: ${({ isActive, theme }) =>
    isActive ? theme.shadows.sm : 'none'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  border: none;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.gray[700] : 'transparent'};
  }
`;

export const FoldersPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState<ViewType>(VIEW_TYPES.ALL);

    const debouncedSearch = useDebounce(searchQuery, 300);
    const { addFolder } = useFolders();
    const { showToast } = useToast();

    const handleAddFolder = (data: FolderFormData) => {
        const newFolder = addFolder(data.name, data.color);
        showToast('success', 'Success', `Folder '${newFolder.name}' has been created successfully.`);
    };

    const handleFolderClick = (folderId: string) => {
        // Navigate to folder detail page
        console.log('Navigate to folder:', folderId);
    };

    const handleFolderMenuClick = (folderId: string, event: React.MouseEvent) => {
        // Show folder context menu
        console.log('Show menu for folder:', folderId);
    };

    return (
        <>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-folder" />
                    My Feeds
                </PageTitle>

                <Actions>
                    <SearchWrapper>
                        <Input
                            type="text"
                            placeholder="Search folders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon="search"
                        />
                    </SearchWrapper>

                    <Button onClick={() => setShowModal(true)} leftIcon="plus">
                        Add Folder
                    </Button>
                </Actions>
            </PageHeader>

            <ViewOptions>
                <ViewTabs>
                    <ViewTab
                        isActive={activeView === VIEW_TYPES.ALL}
                        onClick={() => setActiveView(VIEW_TYPES.ALL)}
                    >
                        All Folders
                    </ViewTab>
                    <ViewTab
                        isActive={activeView === VIEW_TYPES.RECENT}
                        onClick={() => setActiveView(VIEW_TYPES.RECENT)}
                    >
                        Recent
                    </ViewTab>
                    <ViewTab
                        isActive={activeView === VIEW_TYPES.FAVORITES}
                        onClick={() => setActiveView(VIEW_TYPES.FAVORITES)}
                    >
                        Favorites
                    </ViewTab>
                </ViewTabs>
            </ViewOptions>

            <FolderList
                filters={{
                    search: debouncedSearch,
                    view: activeView
                }}
                onFolderClick={handleFolderClick}
                onFolderMenuClick={handleFolderMenuClick}
                onCreateClick={() => setShowModal(true)}
            />

            <FolderModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddFolder}
            />
        </>
    );
};
