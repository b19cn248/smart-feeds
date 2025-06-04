// src/pages/SourcesPage/SourcesPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { SourceList } from '../../components/features/source/SourceList';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ErrorBoundary } from '../../components/common/ErrorBoundary'; // Import ErrorBoundary
import { useSource } from '../../contexts/SourceContext';
import { useToast } from '../../contexts/ToastContext';
import { useCategories } from '../../hooks';
import { Source, CreateSourceRequest, UpdateSourceRequest } from '../../types';
import { useDebounce } from '../../hooks';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { SourceToFolderModal } from '../../components/features/source/SourceToFolderModal';

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

const CategorySelect = styled.select`
    padding: 12px 16px;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    transition: ${({ theme }) => theme.transitions.default};

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary.main};
        outline: none;
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}20;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Label = styled.label`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 8px;
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

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-top: 4px;
`;

const LoadingIndicator = styled.div`
    padding: 20px;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

// Error fallback component cho SourceList
const SourceListErrorFallback = styled.div`
    padding: 32px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    border: 2px dashed ${({ theme }) => theme.colors.error};
`;

export const SourcesPage: React.FC = () => {
    // Contexts và hooks
    const { sources, isLoading, error, fetchSources, addSource, updateSource, deleteSource } = useSource();
    const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
    const { showToast } = useToast();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSource, setSelectedSource] = useState<Source | null>(null);
    const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);

    // Form state
    const [sourceUrl, setSourceUrl] = useState('');
    const [sourceName, setSourceName] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [sourceType, setSourceType] = useState('RSS');
    const [sourceActive, setSourceActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation errors
    const [formErrors, setFormErrors] = useState({
        name: '',
        url: '',
        category: ''
    });

    // Debounced search
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Error handling callback cho ErrorBoundary
    const handleSourceListError = (error: Error, errorInfo: React.ErrorInfo) => {
        console.error('SourceList Error:', error, errorInfo);
        showToast('error', 'Error', 'There was an issue loading the sources. Please refresh the page.');
    };

    // Validation functions
    const validateForm = (): boolean => {
        const errors = {
            name: '',
            url: '',
            category: ''
        };

        if (!sourceName.trim()) {
            errors.name = 'Source name is required';
        }

        if (!sourceUrl.trim()) {
            errors.url = 'Source URL is required';
        } else {
            try {
                new URL(sourceUrl);
            } catch {
                errors.url = 'Please enter a valid URL';
            }
        }

        if (!categoryId) {
            errors.category = 'Please select a category';
        }

        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    // Handle source click
    const handleSourceClick = (sourceId: number) => {
        // Đã được xử lý trong SourceCard để điều hướng trực tiếp đến trang chi tiết
    };

    // Open edit modal
    const handleEditClick = (sourceId: number) => {
        const source = sources.find(s => s && s.id === sourceId); // Thêm null check
        if (source) {
            setSelectedSource(source);
            setSourceUrl(source.url || '');
            setSourceName(source.name || '');
            setCategoryId(source.category_id || '');
            setSourceType(source.type || 'RSS');
            setSourceActive(source.active ?? true);
            setShowEditModal(true);
            setFormErrors({ name: '', url: '', category: '' });
        }
    };

    // Open delete modal
    const handleDeleteClick = (sourceId: number) => {
        const source = sources.find(s => s && s.id === sourceId); // Thêm null check
        if (source) {
            setSelectedSource(source);
            setShowDeleteModal(true);
        }
    };

    // Handle add to folder
    const handleAddToFolderClick = (sourceId: number) => {
        const source = sources.find(s => s && s.id === sourceId); // Thêm null check
        if (source) {
            setSelectedSource(source);
            setShowAddToFolderModal(true);
        }
    };

    // Handle add source
    const handleAddSource = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const newSource: CreateSourceRequest = {
                name: sourceName.trim(),
                url: sourceUrl.trim(),
                category_id: categoryId as number
            };

            await addSource(newSource);
            showToast('success', 'Success', 'Source added successfully');
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            console.error('Error adding source:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to add source';
            showToast('error', 'Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle update source
    const handleUpdateSource = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSource || !validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedSource: UpdateSourceRequest = {
                name: sourceName.trim(),
                url: sourceUrl.trim(),
                category_id: categoryId as number,
                type: sourceType,
                active: sourceActive
            };

            await updateSource(selectedSource.id, updatedSource);
            showToast('success', 'Success', 'Source updated successfully');
            setShowEditModal(false);
            resetForm();
        } catch (error) {
            console.error('Error updating source:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update source';
            showToast('error', 'Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete source
    const handleDeleteSource = async () => {
        if (!selectedSource) return;

        setIsSubmitting(true);

        try {
            await deleteSource(selectedSource.id);
            showToast('success', 'Success', 'Source deleted successfully');
            setShowDeleteModal(false);
            setSelectedSource(null);
        } catch (error) {
            console.error('Error deleting source:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete source';
            showToast('error', 'Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setSourceUrl('');
        setSourceName('');
        setCategoryId('');
        setSourceType('RSS');
        setSourceActive(true);
        setSelectedSource(null);
        setFormErrors({ name: '', url: '', category: '' });
    };

    // Handle refresh
    const handleRefresh = async () => {
        try {
            await fetchSources();
            showToast('success', 'Success', 'Sources refreshed');
        } catch (error) {
            showToast('error', 'Error', 'Failed to refresh sources');
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        resetForm();
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
                <ErrorMessage style={{ marginBottom: '20px' }}>
                    Error: {error}
                </ErrorMessage>
            )}

            {categoriesError && (
                <ErrorMessage style={{ marginBottom: '20px' }}>
                    Categories Error: {categoriesError}
                </ErrorMessage>
            )}

            {/* Wrap SourceList với ErrorBoundary để catch runtime errors */}
            <ErrorBoundary
                onError={handleSourceListError}
                fallback={
                    <SourceListErrorFallback>
                        <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: 'red', marginBottom: '16px' }} />
                        <h3>Error loading sources</h3>
                        <p>There was an issue displaying the sources list. Please refresh the page.</p>
                        <Button onClick={handleRefresh} style={{ marginTop: '16px' }}>
                            Refresh Sources
                        </Button>
                    </SourceListErrorFallback>
                }
            >
                <SourceList
                    sources={sources}
                    onSourceClick={handleSourceClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    onAddToFolderClick={handleAddToFolderClick}
                    searchQuery={debouncedSearch}
                />
            </ErrorBoundary>

            {/* Add Source Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                title="Add New Source"
                size="md"
            >
                <Form onSubmit={handleAddSource}>
                    <FormGroup>
                        <Input
                            label="Source Name"
                            placeholder="Enter source name"
                            value={sourceName}
                            onChange={(e) => setSourceName(e.target.value)}
                            leftIcon="tag"
                            error={formErrors.name}
                            required
                            disabled={isSubmitting}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input
                            label="Source URL"
                            placeholder="https://example.com/feed"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            leftIcon="link"
                            error={formErrors.url}
                            required
                            disabled={isSubmitting}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Category</Label>
                        <CategorySelect
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                            disabled={categoriesLoading || isSubmitting}
                            required
                        >
                            <option value="">Select a category...</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </CategorySelect>
                        {formErrors.category && (
                            <ErrorMessage>{formErrors.category}</ErrorMessage>
                        )}
                        {categoriesLoading && (
                            <LoadingIndicator>Loading categories...</LoadingIndicator>
                        )}
                    </FormGroup>

                    <ButtonGroup>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            disabled={categoriesLoading}
                        >
                            Add Source
                        </Button>
                    </ButtonGroup>
                </Form>
            </Modal>

            {/* Edit Source Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={handleCloseModal}
                title="Edit Source"
                size="md"
            >
                <Form onSubmit={handleUpdateSource}>
                    <FormGroup>
                        <Input
                            label="Source Name"
                            placeholder="Enter source name"
                            value={sourceName}
                            onChange={(e) => setSourceName(e.target.value)}
                            leftIcon="tag"
                            error={formErrors.name}
                            required
                            disabled={isSubmitting}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input
                            label="Source URL"
                            placeholder="https://example.com/feed"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            leftIcon="link"
                            error={formErrors.url}
                            required
                            disabled={isSubmitting}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Category</Label>
                        <CategorySelect
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                            disabled={categoriesLoading || isSubmitting}
                            required
                        >
                            <option value="">Select a category...</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </CategorySelect>
                        {formErrors.category && (
                            <ErrorMessage>{formErrors.category}</ErrorMessage>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label>Type</Label>
                        <RadioGroup>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="type"
                                    value="RSS"
                                    checked={sourceType === 'RSS'}
                                    onChange={() => setSourceType('RSS')}
                                    disabled={isSubmitting}
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
                        <Label>Status</Label>
                        <RadioGroup>
                            <RadioLabel>
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={sourceActive}
                                    onChange={() => setSourceActive(true)}
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                />
                                Inactive
                            </RadioLabel>
                        </RadioGroup>
                    </FormGroup>

                    <ButtonGroup>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            disabled={categoriesLoading}
                        >
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
                <p><strong>{selectedSource?.name}</strong></p>
                <p>URL: {selectedSource?.url}</p>
                <p>This action cannot be undone.</p>

                <ButtonGroup>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleDeleteSource}
                        isLoading={isSubmitting}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </Modal>

            {/* Add to Folder Modal */}
            <SourceToFolderModal
                isOpen={showAddToFolderModal}
                onClose={() => setShowAddToFolderModal(false)}
                source={selectedSource}
            />
        </>
    );
};