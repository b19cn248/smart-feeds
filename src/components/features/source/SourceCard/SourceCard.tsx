// src/components/features/source/SourceCard/SourceCard.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Thêm import này
import { Source } from '../../../../types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';

const SourceContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const SourceHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const SourceIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => `${theme.colors.primary.main}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
        font-size: 18px;
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const SourceInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const SourceUrl = styled.h3`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SourceType = styled.div`
    display: inline-block;
    padding: 2px 8px;
    background-color: ${({ theme }) => `${theme.colors.primary.main}10`};
    color: ${({ theme }) => theme.colors.primary.main};
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SourceMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    padding-top: 12px;
    margin-top: 10px;
`;

const SourceStatus = styled.div<{ active: boolean }>`
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
        color: ${({ active, theme }) => active ? theme.colors.success : theme.colors.error};
    }
`;

const SourceDate = styled.div``;

const SourceActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.text.primary};
    }
`;

interface SourceCardProps {
    source: Source;
    onClick?: () => void;
    onEditClick?: (e: React.MouseEvent) => void;
    onDeleteClick?: (e: React.MouseEvent) => void;
    onAddToFolderClick?: (e: React.MouseEvent) => void; // Thêm prop mới
}

export const SourceCard: React.FC<SourceCardProps> = ({
                                                          source,
                                                          onClick,
                                                          onEditClick,
                                                          onDeleteClick,
                                                          onAddToFolderClick // Thêm prop mới
                                                      }) => {
    const navigate = useNavigate(); // Thêm hook để điều hướng

    // Helper để lấy domain từ URL
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch (error) {
            return url;
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEditClick) onEditClick(e);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDeleteClick) onDeleteClick(e);
    };

    // Thêm handler mới cho nút Add to Folder
    const handleAddToFolderClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddToFolderClick) onAddToFolderClick(e);
    };

    // Sửa hàm xử lý click để điều hướng đến trang chi tiết
    const handleCardClick = () => {
        navigate(`/sources/${source.id}`);
    };

    return (
        <Card onClick={handleCardClick}> {/* Thay đổi từ onClick thành handleCardClick */}
            <SourceContent>
                <SourceHeader>
                    <SourceIcon>
                        <i className="fas fa-rss" />
                    </SourceIcon>
                    <SourceInfo>
                        <SourceUrl title={source.url}>{getDomain(source.url)}</SourceUrl>
                        <SourceType>{source.type}</SourceType>
                    </SourceInfo>
                </SourceHeader>

                <SourceMeta>
                    <SourceStatus active={source.active}>
                        <i className={`fas fa-${source.active ? 'circle-check' : 'circle-xmark'}`} />
                        {source.active ? 'Active' : 'Inactive'}
                    </SourceStatus>
                    <SourceDate>{formatDate(new Date(source.created_at))}</SourceDate>
                </SourceMeta>

                <SourceActions>
                    <ActionButton onClick={handleEditClick} title="Edit source">
                        <i className="fas fa-edit" />
                    </ActionButton>
                    <ActionButton onClick={handleDeleteClick} title="Delete source">
                        <i className="fas fa-trash" />
                    </ActionButton>
                    {/* Thêm nút Add to Folder */}
                    <ActionButton onClick={handleAddToFolderClick} title="Add to folder">
                        <i className="fas fa-folder-plus" />
                    </ActionButton>
                </SourceActions>
            </SourceContent>
        </Card>
    );
};