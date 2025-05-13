// src/pages/FoldersPage/FoldersPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FolderList } from '../../components/features/folder/FolderList';
import { FolderModal } from '../../components/features/folder/FolderModal';
import { FolderDetailModal } from '../../components/features/folder/FolderDetailModal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useFolder } from '../../contexts/FolderContext';
import { useDebounce } from '../../hooks';
import { useToast } from '../../contexts/ToastContext';
import { VIEW_TYPES } from '../../constants';
import { ViewType, FolderFormData } from '../../types';
import { useFilteredFolders } from '../../hooks';

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
    
`;

const ErrorMessage = styled.div`
    background-color: ${({ theme }) => `${theme.colors.error}10`};
    color: ${({ theme }) => theme.colors.error};
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.radii.md};
    margin-bottom: 24px;
    display: flex;
    align-items: center;

    i {
        margin-right: 8px;
    }
`;

export const FoldersPage: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState<ViewType>(VIEW_TYPES.ALL);
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { addFolder, isLoading, error, fetchFolders } = useFolder();
    const { showToast } = useToast();

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Handle creating a new folder
    const handleAddFolder = async (data: FolderFormData) => {
        try {
            const newFolder = await addFolder(data.name, data.color);
            showToast('success', 'Success', `Folder '${newFolder.name}' has been created successfully.`);
            setShowCreateModal(false);
        } catch (error) {
            showToast('error', 'Error', 'Failed to create folder. Please try again.');
        }
    };

    // Handle clicking on a folder to show details
    const handleFolderClick = (folderId: number) => {
        setSelectedFolderId(folderId);
        setShowDetailModal(true);
    };

    // Handle folder menu click (not implemented yet)
    const handleFolderMenuClick = (folderId: number, event: React.MouseEvent) => {
        // Future implementation for folder menu
        console.log('Show menu for folder:', folderId);
    };

    // Handle refreshing folders list
    const handleRefresh = () => {
        fetchFolders()
            .then(() => {
                showToast('success', 'Success', 'Folders refreshed');
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to refresh folders');
            });
    };

    // Use the custom hook to filter folders
    const filteredFolders = useFilteredFolders({
        search: debouncedSearch,
        view: activeView
    });

    // Show loading screen while initially loading
    if (isLoading && filteredFolders.length === 0) {
        return <LoadingScreen />;
    }

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

                    <Button onClick={() => setShowCreateModal(true)} leftIcon="plus">
                        Add Folder
                    </Button>

                    <Button variant="ghost" onClick={handleRefresh} leftIcon="sync">
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {error && (
                <ErrorMessage>
                    <i className="fas fa-exclamation-circle" />
                    {error}
                </ErrorMessage>
            )}

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
                onCreateClick={() => setShowCreateModal(true)}
            />

            {/* Create Folder Modal */}
            <FolderModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleAddFolder}
                mode="create"
                isLoading={isLoading}
            />

            {/* Folder Detail Modal */}
            <FolderDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                folderId={selectedFolderId}
            />
        </>
    );
};