import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Folder } from '../types';
import { generateId } from '../utils/helpers';

interface FolderContextProps {
    folders: Folder[];
    addFolder: (name: string, color: string) => Folder;
    deleteFolder: (id: string) => void;
    updateFolder: (folder: Folder) => void;
}

const FolderContext = createContext<FolderContextProps>({
    folders: [],
    addFolder: () => ({} as Folder),
    deleteFolder: () => {},
    updateFolder: () => {},
});

export const useFolders = () => useContext(FolderContext);

interface FolderProviderProps {
    children: ReactNode;
}

export const FolderProvider: React.FC<FolderProviderProps> = ({ children }) => {
    const [folders, setFolders] = useState<Folder[]>([
        {
            id: '1',
            name: 'Technology',
            color: '#2E7CF6',
            sourcesCount: 12,
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            isActive: true,
        },
        {
            id: '2',
            name: 'News',
            color: '#F43F5E',
            sourcesCount: 8,
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
            id: '3',
            name: 'Finance',
            color: '#10B981',
            sourcesCount: 5,
            lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
    ]);

    const addFolder = (name: string, color: string): Folder => {
        const newFolder: Folder = {
            id: generateId(),
            name,
            color,
            sourcesCount: 0,
            lastUpdated: new Date(),
        };

        setFolders([newFolder, ...folders]);
        return newFolder;
    };

    const deleteFolder = (id: string) => {
        setFolders(folders.filter(folder => folder.id !== id));
    };

    const updateFolder = (updatedFolder: Folder) => {
        setFolders(
            folders.map(folder => (folder.id === updatedFolder.id ? updatedFolder : folder))
        );
    };

    return (
        <FolderContext.Provider value={{ folders, addFolder, deleteFolder, updateFolder }}>
            {children}
        </FolderContext.Provider>
    );
};