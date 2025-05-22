// src/components/features/folder/SourcePicker/SourcePicker.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Source } from '../../../../types';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { useSource } from '../../../../contexts/SourceContext';
import { useDebounce } from '../../../../hooks';

const SourceList = styled.div`
    max-height: 300px;
    overflow-y: auto;
    margin: 16px 0;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};
`;

const SourceItem = styled.div<{ isSelected: boolean }>`
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    background-color: ${({ isSelected, theme }) =>
            isSelected ? `${theme.colors.primary.main}10` : 'transparent'};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${({ isSelected, theme }) =>
                isSelected ? `${theme.colors.primary.main}20` : theme.colors.gray[100]};
    }
`;

const SourceInfo = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
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

const SourceNameUrl = styled.div`
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

const SourceType = styled.div`
    flex-shrink: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-top: 4px;
`;

const SourceStatus = styled.div<{ active: boolean }>`
    display: flex;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ active, theme }) => active ? theme.colors.success : theme.colors.error};
    margin-left: 12px;

    i {
        margin-right: 6px;
    }
`;

const NoResultsMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SearchWrapper = styled.div`
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

interface SourcePickerProps {
    onSelect: (sourceIds: number[]) => void;
    onCancel: () => void;
    excludeSourceIds?: number[];
    isLoading?: boolean;
}

export const SourcePicker: React.FC<SourcePickerProps> = ({
                                                              onSelect,
                                                              onCancel,
                                                              excludeSourceIds = [],
                                                              isLoading = false,
                                                          }) => {
    const { sources, fetchSources, isLoading: isSourceLoading } = useSource();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filter sources by search query and exclude already added sources
    const filteredSources = sources.filter(source =>
        (debouncedSearch === '' ||
            source.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            source.url.toLowerCase().includes(debouncedSearch.toLowerCase())) &&
        !excludeSourceIds.includes(source.id)
    );

    // Fetch sources when component mounts
    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    const handleSourceToggle = (sourceId: number) => {
        setSelectedSourceIds(prev =>
            prev.includes(sourceId)
                ? prev.filter(id => id !== sourceId)
                : [...prev, sourceId]
        );
    };

    const handleAddSources = () => {
        if (selectedSourceIds.length > 0) {
            onSelect(selectedSourceIds);
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

    return (
        <div>
            <SearchWrapper>
                <Input
                    type="text"
                    placeholder="Search sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon="search"
                    disabled={isLoading || isSourceLoading}
                />
            </SearchWrapper>

            <SourceList>
                {isSourceLoading ? (
                    <NoResultsMessage>Loading sources...</NoResultsMessage>
                ) : filteredSources.length > 0 ? (
                    filteredSources.map((source) => {
                        const hasImage = !!source.image_url;

                        return (
                            <SourceItem
                                key={source.id}
                                isSelected={selectedSourceIds.includes(source.id)}
                                onClick={() => handleSourceToggle(source.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSourceIds.includes(source.id)}
                                    onChange={() => handleSourceToggle(source.id)}
                                    onClick={e => e.stopPropagation()}
                                    style={{ marginRight: 12 }}
                                />
                                <SourceInfo>
                                    <SourceImage hasImage={hasImage}>
                                        {hasImage ? (
                                            <img src={source.image_url} alt={source.name} />
                                        ) : (
                                            <i className="fas fa-rss" />
                                        )}
                                    </SourceImage>
                                    <SourceNameUrl>
                                        <SourceName title={source.name}>
                                            {source.name}
                                        </SourceName>
                                        <SourceUrl title={source.url}>
                                            {getDomain(source.url)}
                                        </SourceUrl>
                                    </SourceNameUrl>
                                </SourceInfo>
                                <SourceStatus active={source.active}>
                                    <i className={`fas fa-${source.active ? 'circle-check' : 'circle-xmark'}`} />
                                    {source.active ? 'Active' : 'Inactive'}
                                </SourceStatus>
                            </SourceItem>
                        );
                    })
                ) : (
                    <NoResultsMessage>
                        {debouncedSearch
                            ? 'No sources found. Try a different search query.'
                            : 'No sources available.'}
                    </NoResultsMessage>
                )}
            </SourceList>

            <ButtonGroup>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleAddSources}
                    disabled={selectedSourceIds.length === 0 || isLoading}
                    isLoading={isLoading}
                >
                    Add Source{selectedSourceIds.length > 1 ? 's' : ''}
                </Button>
            </ButtonGroup>
        </div>
    );
};