// src/pages/SourcesPage/SourcesPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { SourceList } from '../../components/features/source/SourceList';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useSource } from '../../contexts/SourceContext';
import { useToast } from '../../contexts/ToastContext';
import { Source } from '../../types';
import { useDebounce } from '../../hooks';
import { LoadingScreen } from '../../components/common/LoadingScreen';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

export const SourcesPage: React.FC = () => {
    // Source context and state
    const { sources, isLoading, error, fetchSources, addSource, updateSource, deleteSource } = useSource();
    const { showToast } = useToast();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSource, setSelectedSource] = useState<Source | null>(null);

    // Form state
    const [sourceUrl, setSourceUrl] = useState('');
    const [sourceType, setSourceType] = useState('RSS');
    const [sourceActive, setSourceActive] = useState(true);

    // Debounced search
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Handle source click
    const handleSourceClick = (sourceId: number) => {
        // You can implement navigation to source details page here
        console.log('Source clicked:', sourceId);
    };

    // Open edit modal
    const handleEditClick = (sourceId: number) => {
        const source = sources.find(s => s.id === sourceId);
        if (source) {
            setSelectedSource(source);
            setSourceUrl(source.url);
            setSourceType(source.type);
            setSourceActive(source.active);
            setShowEditModal(true);
        }
    };

    // Open delete modal
    const handleDeleteClick = (sourceId: number) => {
        const source = sources.find(s => s.id === sourceId);
        if (source) {
            setSelectedSource(source);
            setShowDeleteModal(true);
        }
    };

    // Handle add source
    const handleAddSource = (e: React.FormEvent) => {
        e.preventDefault();

        if (!sourceUrl.trim()) {
            showToast('error', 'Error', 'Please enter a valid URL');
            return;
        }

        // Create new source object
        const newSource: Omit<Source, 'id'> = {
            url: sourceUrl,
            type: sourceType,
            language: null,
            account_id: null,
            hashtag: null,
            category: null,
            user_id: 1, // Assuming current user ID is 1
            active: sourceActive,
            created_at: new Date().toISOString(),
        };

        // Add source
        addSource(newSource)
            .then(() => {
                showToast('success', 'Success', 'Source added successfully');
                setShowAddModal(false);
                resetForm();
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to add source');
            });
    };

    // Handle update source
    const handleUpdateSource = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSource) return;
        if (!sourceUrl.trim()) {
            showToast('error', 'Error', 'Please enter a valid URL');
            return;
        }

        // Create updated source object
        const updatedSource: Source = {
            ...selectedSource,
            url: sourceUrl,
            type: sourceType,
            active: sourceActive,
        };

        // Update source
        updateSource(updatedSource)
            .then(() => {
                showToast('success', 'Success', 'Source updated successfully');
                setShowEditModal(false);
                resetForm();
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to update source');
            });
    };

    // Handle delete source
    const handleDeleteSource = () => {
        if (!selectedSource) return;

        // Delete source
        deleteSource(selectedSource.id)
            .then(() => {
                showToast('success', 'Success', 'Source deleted successfully');
                setShowDeleteModal(false);
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to delete source');
            });
    };

    // Reset form
    const resetForm = () => {
        setSourceUrl('');
        setSourceType('RSS');
        setSourceActive(true);
        setSelectedSource(null);
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchSources()
            .then(() => {
                showToast('success', 'Success', 'Sources refreshed');
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to refresh sources');
            });
    };

    if (isLoading && sources.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-rss" />
                    Sources
                </PageTitle>

                <Actions>
                    <SearchWrapper>
                        <Input
                            type="text"
                            placeholder="Search sources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon="search"
                        />
                    </SearchWrapper>

                    <Button onClick={() => setShowAddModal(true)} leftIcon="plus">
                        Add Source
                    </Button>

                    <Button variant="ghost" onClick={handleRefresh} leftIcon="sync">
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {error && (
                <div style={{ marginBottom: '20px', color: 'red' }}>
                    Error: {error}
                </div>
            )}

            <SourceList
                sources={sources}
                onSourceClick={handleSourceClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                searchQuery={debouncedSearch}
            />

            {/* Add Source Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Source"
                size="sm"
            >
                <Form onSubmit={handleAddSource}>
                    <FormGroup>
                        <Input
                            label="Source URL"
                            placeholder="https://example.com/feed"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            leftIcon="link"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Type</label>
                        <RadioGroup>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="type"
                                    value="RSS"
                                    checked={sourceType === 'RSS'}
                                    onChange={() => setSourceType('RSS')}
                                />
                                RSS
                            </RadioLabel>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="type"
                                    value="API"
                                    checked={sourceType === 'API'}
                                    onChange={() => setSourceType('API')}
                                />
                                API
                            </RadioLabel>
                        </RadioGroup>
                    </FormGroup>

                    <FormGroup>
                        <label>Status</label>
                        <RadioGroup>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={sourceActive}
                                    onChange={() => setSourceActive(true)}
                                />
                                Active
                            </RadioLabel>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="status"
                                    value="inactive"
                                    checked={!sourceActive}
                                    onChange={() => setSourceActive(false)}
                                />
                                Inactive
                            </RadioLabel>
                        </RadioGroup>
                    </FormGroup>

                    <ButtonGroup>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Source
                        </Button>
                    </ButtonGroup>
                </Form>
            </Modal>

            {/* Edit Source Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Source"
                size="sm"
            >
                <Form onSubmit={handleUpdateSource}>
                    <FormGroup>
                        <Input
                            label="Source URL"
                            placeholder="https://example.com/feed"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            leftIcon="link"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Type</label>
                        <RadioGroup>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="type"
                                    value="RSS"
                                    checked={sourceType === 'RSS'}
                                    onChange={() => setSourceType('RSS')}
                                />
                                RSS
                            </RadioLabel>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="type"
                                    value="API"
                                    checked={sourceType === 'API'}
                                    onChange={() => setSourceType('API')}
                                />
                                API
                            </RadioLabel>
                        </RadioGroup>
                    </FormGroup>

                    <FormGroup>
                        <label>Status</label>
                        <RadioGroup>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={sourceActive}
                                    onChange={() => setSourceActive(true)}
                                />
                                Active
                            </RadioLabel>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="status"
                                    value="inactive"
                                    checked={!sourceActive}
                                    onChange={() => setSourceActive(false)}
                                />
                                Inactive
                            </RadioLabel>
                        </RadioGroup>
                    </FormGroup>

                    <ButtonGroup>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </ButtonGroup>
                </Form>
            </Modal>

            {/* Delete Source Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Source"
                size="sm"
            >
                <p>Are you sure you want to delete this source?</p>
                <p><strong>{selectedSource?.url}</strong></p>
                <p>This action cannot be undone.</p>

                <ButtonGroup>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleDeleteSource}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </Modal>
        </>
    );
};