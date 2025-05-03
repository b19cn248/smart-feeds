// src/contexts/FolderContext/FolderContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Folder } from '../../types';
import { generateId } from '../../utils';

// Action types
type FolderAction =
    | { type: 'ADD_FOLDER'; payload: Folder }
    | { type: 'UPDATE_FOLDER'; payload: Folder }
    | { type: 'DELETE_FOLDER'; payload: string }
    | { type: 'SET_FOLDERS'; payload: Folder[] };

// Context value interface
interface FolderContextValue {
    folders: Folder[];
    addFolder: (name: string, color: string) => Folder;
    updateFolder: (folder: Folder) => void;
    deleteFolder: (id: string) => void;
    setFolders: (folders: Folder[]) => void;
}

// Initial state
const initialState: Folder[] = [
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
];

// Reducer
const folderReducer = (state: Folder[], action: FolderAction): Folder[] => {
    switch (action.type) {
        case 'ADD_FOLDER':
            return [action.payload, ...state];

        case 'UPDATE_FOLDER':
            return state.map(folder =>
                folder.id === action.payload.id ? action.payload : folder
            );

        case 'DELETE_FOLDER':
            return state.filter(folder => folder.id !== action.payload);

        case 'SET_FOLDERS':
            return action.payload;

        default:
            return state;
    }
};

// Create context
export const FolderContext = createContext<FolderContextValue | undefined>(undefined);

// Provider component
export const FolderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [folders, dispatch] = useReducer(folderReducer, initialState);

    const addFolder = useCallback((name: string, color: string): Folder => {
        const newFolder: Folder = {
            id: generateId(),
            name,
            color,
            sourcesCount: 0,
            lastUpdated: new Date(),
            isActive: false,
        };

        dispatch({ type: 'ADD_FOLDER', payload: newFolder });
        return newFolder;
    }, []);

    const updateFolder = useCallback((folder: Folder) => {
        dispatch({ type: 'UPDATE_FOLDER', payload: folder });
    }, []);

    const deleteFolder = useCallback((id: string) => {
        dispatch({ type: 'DELETE_FOLDER', payload: id });
    }, []);

    const setFolders = useCallback((folders: Folder[]) => {
        dispatch({ type: 'SET_FOLDERS', payload: folders });
    }, []);

    const value = {
        folders,
        addFolder,
        updateFolder,
        deleteFolder,
        setFolders,
    };

    return (
        <FolderContext.Provider value={value}>
            {children}
        </FolderContext.Provider>
    );
};
