// src/components/features/folder/FolderDetailModal/FolderDetailModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '../../../common/Modal';
import { Button } from '../../../common/Button';
import { SourcePicker } from '../SourcePicker';
import { useFolder } from '../../../../contexts/FolderContext';
import { Folder } from '../../../../types';
import { formatDate } from '../../../../utils';
import { folderService } from '../../../../services/folderService';

const DetailSection = styled.div`
    margin-bottom: 24px;
`;

const FolderHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`;

const ColorDot = styled.div<{ color: string }>`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin-right: 8px;
`;

const FolderName = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
`;

const FolderMeta = styled.div`
    display: flex;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 16px;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;

    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const SourcesHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SourcesList = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  max-height: 300px;
  overflow-y: auto;
`;

const SourceItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

const SourceInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
`;

const SourceImage = styled.div<{ hasImage: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme, hasImage }) => hasImage ? 'transparent' : `${theme.colors.primary.main}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
  overflow: hidden;

  i {
    font-size: 16px;
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
  min-width: 0;
`;

const SourceName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SourceUrl = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

interface FolderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    folderId: number | null;
}

export const FolderDetailModal: React.FC<FolderDetailModalProps> = ({
                                                                        isOpen,
                                                                        onClose,
                                                                        folderId
                                                                    }) => {
    const { getFolderById, selectedFolder, selectedFolderSources, isLoading, addSourceToFolder } = useFolder();
    const [showSourcePicker, setShowSourcePicker] = useState(false);
    const [addingSource, setAddingSource] = useState(false);
    const [removingSourceId, setRemovingSourceId] = useState<number | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [showConfirm, setShowConfirm] = useState<{ sourceId: number, sourceName: string } | null>(null);

    // Load folder details when the modal opens
    useEffect(() => {
        if (isOpen && folderId !== null) {
            getFolderById(folderId);
        }
    }, [isOpen, folderId, getFolderById]);

    // Handle adding sources to the folder (multi)
    const handleAddSources = async (sourceIds: number[]) => {
        if (!folderId) return;
        setAddingSource(true);
        try {
            await folderService.addSourceToFolder(folderId, sourceIds);
            setShowSourcePicker(false);
            await getFolderById(folderId); // Refresh folder data
        } catch (error) {
            console.error('Error adding sources to folder:', error);
        } finally {
            setAddingSource(false);
        }
    };

    // Handle remove source from folder
    const handleRemoveSource = async (sourceId: number) => {
        if (!folderId) return;
        setIsRemoving(true);
        try {
            await folderService.removeSourceFromFolder(folderId, sourceId);
            await getFolderById(folderId); // Refresh folder data
            setShowConfirm(null);
        } catch (error) {
            // Có thể show toast ở đây nếu muốn
            console.error('Error removing source from folder:', error);
        } finally {
            setIsRemoving(false);
        }
    };

    // Extract domain from URL for better display
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    // Only render content when we have a selected folder
    const renderContent = () => {
        if (!selectedFolder) {
            return (
                <EmptyState>
                    {isLoading ? 'Loading folder details...' : 'Folder not found'}
                </EmptyState>
            );
        }

        return (
            <>
                <DetailSection>
                    <FolderHeader>
                        <ColorDot color={selectedFolder.color} />
                        <FolderName>{selectedFolder.name}</FolderName>
                    </FolderHeader>
                    <FolderMeta>
                        <MetaItem>
                            <i className="fas fa-calendar" />
                            Created {formatDate(selectedFolder.lastUpdated)}
                        </MetaItem>
                        <MetaItem>
                            <i className="fas fa-tag" />
                            Theme: {selectedFolder.theme}
                        </MetaItem>
                    </FolderMeta>
                </DetailSection>

                <DetailSection>
                    {showSourcePicker ? (
                        <SourcePicker
                            onSelect={handleAddSources}
                            onCancel={() => setShowSourcePicker(false)}
                            excludeSourceIds={selectedFolderSources.map(source => source.id)}
                            isLoading={addingSource}
                        />
                    ) : (
                        <>
                            <SourcesHeader>
                                <SectionTitle>Sources ({selectedFolderSources.length})</SectionTitle>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    leftIcon="plus"
                                    onClick={() => setShowSourcePicker(true)}
                                >
                                    Add Source
                                </Button>
                            </SourcesHeader>

                            {selectedFolderSources.length > 0 ? (
                                <SourcesList>
                                    {selectedFolderSources.map(source => {
                                        const hasImage = !!source.image_url;

                                        return (
                                            <SourceItem key={source.id}>
                                                <SourceInfo>
                                                    <SourceImage hasImage={hasImage}>
                                                        {hasImage ? (
                                                            <img src={source.image_url} alt={source.name} />
                                                        ) : (
                                                            <i className="fas fa-rss" />
                                                        )}
                                                    </SourceImage>
                                                    <SourceDetails>
                                                        <SourceName title={source.name}>
                                                            {source.name}
                                                        </SourceName>
                                                        <SourceUrl title={source.url}>
                                                            {getDomain(source.url)}
                                                        </SourceUrl>
                                                    </SourceDetails>
                                                </SourceInfo>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setShowConfirm({
                                                        sourceId: source.id,
                                                        sourceName: source.name
                                                    })}
                                                    title="Remove source from folder"
                                                >
                                                    <i className="fas fa-trash" />
                                                </Button>
                                            </SourceItem>
                                        );
                                    })}
                                </SourcesList>
                            ) : (
                                <EmptyState>
                                    No sources added to this folder yet.
                                </EmptyState>
                            )}
                        </>
                    )}
                </DetailSection>

                <ActionButtons>
                    <Button onClick={onClose}>Close</Button>
                </ActionButtons>
            </>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Folder Details"
            size="md"
        >
            {renderContent()}
            {/* Confirm Remove Source Modal */}
            {showConfirm && (
                <Modal isOpen={true} onClose={() => setShowConfirm(null)} title="Remove Source" size="sm">
                    <p>Are you sure you want to remove <b>{showConfirm.sourceName}</b> from this folder?</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <Button variant="ghost" onClick={() => setShowConfirm(null)} disabled={isRemoving}>Cancel</Button>
                        <Button variant="secondary" onClick={() => handleRemoveSource(showConfirm.sourceId)} isLoading={isRemoving}>Remove</Button>
                    </div>
                </Modal>
            )}
        </Modal>
    );
};