import React from 'react';
import styled from 'styled-components';
import FolderItem from './FolderItem';
import { useFolders } from '../../context/FolderContext';
import { Folder } from '../../types';

const FolderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  background: linear-gradient(180deg, white 0%, #FCFCFD 100%);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  padding: 48px;
  text-align: center;
  max-width: 480px;
  margin: 48px auto;
  border: 1px dashed var(--medium-gray);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
    border-color: var(--medium-gray);
  }
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--light-gray);
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 32px;
    color: var(--primary);
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
`;

const EmptyStateDesc = styled.p`
  color: var(--text-secondary);
  margin-bottom: 24px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  font-size: 14px;
  background-color: var(--primary);
  color: white;

  &:hover {
    background-color: var(--primary-hover);
    box-shadow: var(--shadow);
    transform: translateY(-1px);
  }

  i {
    margin-right: 8px;
  }
`;

interface FolderListProps {
    searchQuery: string;
    activeView: 'all' | 'recent' | 'favorites';
}

const FolderList: React.FC<FolderListProps> = ({ searchQuery, activeView }) => {
    const { folders } = useFolders();

    const filteredFolders = folders.filter(folder => {
        // Filter by search query
        const matchesSearch = searchQuery === '' ||
            folder.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by view type
        let matchesView = true;
        if (activeView === 'recent') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            matchesView = folder.lastUpdated > oneWeekAgo;
        } else if (activeView === 'favorites') {
            matchesView = folder.isActive === true;
        }

        return matchesSearch && matchesView;
    });

    if (filteredFolders.length === 0) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-folder-open"></i>
                </EmptyStateIcon>
                <EmptyStateTitle>
                    {searchQuery ? 'No matching folders found' : 'No folders yet'}
                </EmptyStateTitle>
                <EmptyStateDesc>
                    {searchQuery
                        ? 'Try adjusting your search query or view filter.'
                        : 'Create folders to organize your feeds and make your reading experience more enjoyable'
                    }
                </EmptyStateDesc>
                {!searchQuery && (
                    <AddButton>
                        <i className="fas fa-plus"></i>
                        Add Folder
                    </AddButton>
                )}
            </EmptyState>
        );
    }

    return (
        <FolderGrid>
            {filteredFolders.map((folder) => (
                <FolderItem key={folder.id} folder={folder} />
            ))}
        </FolderGrid>
    );
};

export default FolderList;