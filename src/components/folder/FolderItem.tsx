import React from 'react';
import styled from 'styled-components';
import { Folder } from '../../types';
import { formatDate } from '../../utils/helpers';

const FolderItemWrapper = styled.div`
  background: linear-gradient(180deg, white 0%, #FCFCFD 100%);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  border: 1px solid var(--light-gray);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--medium-gray);
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
  }
`;

const FolderColor = styled.div<{ color: string }>`
  height: 8px;
  background-color: ${props => props.color};
  width: 100%;
`;

const FolderContent = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const FolderHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const FolderIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius);
  background-color: ${props => `${props.color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;

  i {
    font-size: 18px;
    color: ${props => props.color};
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const FolderInfo = styled.div`
  flex: 1;
`;

const FolderName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
  font-size: 16px;
`;

const FolderMeta = styled.div`
  font-size: 13px;
  color: var(--dark-gray);
  display: flex;
  align-items: center;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
  background-color: var(--primary-light);
  color: var(--primary);
`;

const FolderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--light-gray);
  margin-top: 16px;
`;

const FolderSources = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--dark-gray);

  i {
    margin-right: 4px;
    font-size: 12px;
  }
`;

const FolderMenu = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dark-gray);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--light-gray);
    color: var(--darker-gray);
  }
`;

interface FolderItemProps {
    folder: Folder;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
    return (
        <FolderItemWrapper>
            <FolderColor color={folder.color} />
            <FolderContent>
                <FolderHeader>
                    <FolderIcon color={folder.color}>
                        <i className="fas fa-folder"></i>
                    </FolderIcon>
                    <FolderInfo>
                        <FolderName>{folder.name}</FolderName>
                        <FolderMeta>
                            Updated {formatDate(folder.lastUpdated)}
                            {folder.isActive && <Badge>Active</Badge>}
                        </FolderMeta>
                    </FolderInfo>
                </FolderHeader>
                <FolderActions>
                    <FolderSources>
                        <i className="fas fa-rss"></i>
                        {folder.sourcesCount} {folder.sourcesCount === 1 ? 'source' : 'sources'}
                    </FolderSources>
                    <FolderMenu>
                        <i className="fas fa-ellipsis-v"></i>
                    </FolderMenu>
                </FolderActions>
            </FolderContent>
        </FolderItemWrapper>
    );
};

export default FolderItem;