import React, { useState } from 'react';
import styled from 'styled-components';
import FolderList from '../folder/FolderList';
import AddFolderModal from '../folder/AddFolderModal';
import { useFolders } from '../../context/FolderContext';
import { useToast } from '../../context/ToastContext';

const MainContentWrapper = styled.div`
  flex: 1;
  margin-left: 260px;
  padding: 32px;
  transition: var(--transition);

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 24px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;

  i {
    color: var(--primary);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 576px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 240px;
  width: 100%;

  @media (max-width: 576px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border-radius: 20px;
  border: 1px solid var(--medium-gray);
  background-color: white;
  font-size: 14px;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(46, 124, 246, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1E293B;
    border-color: var(--light-gray);
    color: var(--text-primary);
  }
`;

const SearchIcon = styled.i`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--dark-gray);
  font-size: 14px;
`;

const AddFolderButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 20px;
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  font-size: 14px;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: var(--primary-hover);
    box-shadow: var(--shadow);
    transform: translateY(-1px);
  }

  i {
    margin-right: 8px;
  }
`;

const ViewOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const ViewTabs = styled.div`
  display: flex;
  background-color: var(--light-gray);
  border-radius: 20px;
  padding: 4px;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
  }

  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
  }
`;

const ViewTab = styled.div<{ isActive?: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.isActive ? 'var(--text-primary)' : 'var(--text-secondary)'};
  background-color: ${props => props.isActive ? 'white' : 'transparent'};
  box-shadow: ${props => props.isActive ? 'var(--shadow-sm)' : 'none'};
  cursor: pointer;
  transition: var(--transition);

  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.isActive ? '#334155' : 'transparent'};
    color: ${props => props.isActive ? 'white' : 'var(--text-secondary)'};
  }
`;

type ViewType = 'all' | 'recent' | 'favorites';

const MainContent: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState<ViewType>('all');
    const { addFolder } = useFolders();
    const { showToast } = useToast();

    const handleAddFolder = (name: string, color: string) => {
        const newFolder = addFolder(name, color);
        showToast('success', 'Success', `Folder '${newFolder.name}' has been created successfully.`);
        setShowModal(false);
    };

    return (
        <MainContentWrapper>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-folder"></i>
                    My Feeds
                </PageTitle>

                <Actions>
                    <SearchBar>
                        <SearchIcon className="fas fa-search" />
                        <SearchInput
                            type="text"
                            placeholder="Search folders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchBar>

                    <AddFolderButton onClick={() => setShowModal(true)}>
                        <i className="fas fa-plus"></i>
                        Add Folder
                    </AddFolderButton>
                </Actions>
            </PageHeader>

            <ViewOptions>
                <ViewTabs>
                    <ViewTab isActive={activeView === 'all'} onClick={() => setActiveView('all')}>
                        All Folders
                    </ViewTab>
                    <ViewTab isActive={activeView === 'recent'} onClick={() => setActiveView('recent')}>
                        Recent
                    </ViewTab>
                    <ViewTab isActive={activeView === 'favorites'} onClick={() => setActiveView('favorites')}>
                        Favorites
                    </ViewTab>
                </ViewTabs>
            </ViewOptions>

            <FolderList searchQuery={searchQuery} activeView={activeView} />

            {showModal && (
                <AddFolderModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleAddFolder}
                />
            )}
        </MainContentWrapper>
    );
};

export default MainContent;