// src/components/features/source/SourceToFolderModal/SourceToFolderModal.tsx
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Modal} from '../../../common/Modal';
import {Button} from '../../../common/Button';
import {Input} from '../../../common/Input';
import {useFolder} from '../../../../contexts/FolderContext';
import {useToast} from '../../../../contexts/ToastContext';
import {Source} from '../../../../types';
import {useDebounce} from '../../../../hooks';

const SearchWrapper = styled.div`
    margin-bottom: 16px;
`;

const FoldersList = styled.div`
    max-height: 300px;
    overflow-y: auto;
    margin: 16px 0;
    border: 1px solid ${({theme}) => theme.colors.gray[200]};
    border-radius: ${({theme}) => theme.radii.md};
`;

const FolderItem = styled.div<{ isSelected: boolean }>`
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${({theme}) => theme.colors.gray[200]};
    background-color: ${({isSelected, theme}) =>
            isSelected ? `${theme.colors.primary.main}10` : 'transparent'};
    cursor: pointer;
    transition: ${({theme}) => theme.transitions.default};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${({isSelected, theme}) =>
                isSelected ? `${theme.colors.primary.main}20` : theme.colors.gray[100]};
    }
`;

const FolderInfo = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const FolderIcon = styled.div<{ color: string }>`
    width: 32px;
    height: 32px;
    border-radius: ${({theme}) => theme.radii.md};
    background-color: ${props => `${props.color}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;

    i {
        font-size: 16px;
        color: ${props => props.color};
    }
`;

const FolderName = styled.div`
    font-size: ${({theme}) => theme.typography.fontSize.md};
    color: ${({theme}) => theme.colors.text.primary};
    font-weight: ${({theme}) => theme.typography.fontWeight.medium};
`;

const SourceInfo = styled.div`
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.gray[50]};
    border-radius: ${({ theme }) => theme.radii.md};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
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
    margin-right: 16px;
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

const SourceDetails = styled.div`
    flex: 1;
`;

const SourceName = styled.h4`
    margin: 0 0 4px 0;
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const SourceUrl = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoResultsMessage = styled.div`
    padding: 16px;
    text-align: center;
    color: ${({theme}) => theme.colors.text.secondary};
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
`;

interface SourceToFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    source: Source | null;
}

export const SourceToFolderModal: React.FC<SourceToFolderModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            source
                                                                        }) => {
    const {folders, addSourceToFolder, isLoading, fetchFolders} = useFolder();
    const {showToast} = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [addingToFolder, setAddingToFolder] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Fetch folders when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchFolders();
            setSearchQuery('');
            setSelectedFolderId(null);
        }
    }, [isOpen, fetchFolders]);

    // Filter folders based on search
    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // Handle folder click
    const handleFolderClick = (folderId: number) => {
        setSelectedFolderId(folderId);
    };

    // Handle add source to folder
    const handleAddToFolder = async () => {
        if (!source || !selectedFolderId) return;

        try {
            setAddingToFolder(true);
            await addSourceToFolder(selectedFolderId, [source.id]);
            showToast('success', 'Success', `Source added to folder successfully`);
            onClose();
        } catch (error) {
            console.error('Error adding source to folder:', error);
            showToast('error', 'Error', 'Failed to add source to folder');
        } finally {
            setAddingToFolder(false);
        }
    };

    // Extract domain from URL
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    const hasImage: boolean = !!(source && source.image_url);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Add ${source?.name || 'Source'} to Folder`}
            size="md"
        >
            {source && (
                <SourceInfo>
                    <SourceImage hasImage={hasImage}>
                        {hasImage ? (
                            <img src={source.image_url} alt={source.name} />
                        ) : (
                            <i className="fas fa-rss" />
                        )}
                    </SourceImage>
                    <SourceDetails>
                        <SourceName>{source.name}</SourceName>
                        <SourceUrl>{getDomain(source.url)}</SourceUrl>
                    </SourceDetails>
                </SourceInfo>
            )}

            <SearchWrapper>
                <Input
                    type="text"
                    placeholder="Search folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon="search"
                />
            </SearchWrapper>

            <FoldersList>
                {isLoading ? (
                    <NoResultsMessage>Loading folders...</NoResultsMessage>
                ) : filteredFolders.length > 0 ? (
                    filteredFolders.map((folder) => (
                        <FolderItem
                            key={folder.id}
                            isSelected={selectedFolderId === folder.id}
                            onClick={() => handleFolderClick(folder.id)}
                        >
                            <FolderInfo>
                                <FolderIcon color={folder.color}>
                                    <i className="fas fa-folder"/>
                                </FolderIcon>
                                <FolderName>{folder.name}</FolderName>
                            </FolderInfo>
                        </FolderItem>
                    ))
                ) : (
                    <NoResultsMessage>
                        {debouncedSearch
                            ? 'No folders found. Try a different search query.'
                            : 'No folders available. Create a folder first.'}
                    </NoResultsMessage>
                )}
            </FoldersList>

            <ButtonGroup>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={addingToFolder}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleAddToFolder}
                    disabled={selectedFolderId === null || addingToFolder}
                    isLoading={addingToFolder}
                >
                    Add to Folder
                </Button>
            </ButtonGroup>
        </Modal>
    );
};