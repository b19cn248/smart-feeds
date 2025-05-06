// src/contexts/FolderContext/FolderContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode, useEffect, useState } from 'react';
import { Folder, FolderFormData, mapApiToFolder, mapFolderWithSourcesToFolder, getThemeFromColor } from '../../types';
import { folderService } from '../../services';

// Action types
type FolderAction =
    | { type: 'SET_FOLDERS'; payload: Folder[] }
    | { type: 'ADD_FOLDER'; payload: Folder }
    | { type: 'UPDATE_FOLDER'; payload: Folder }
    | { type: 'DELETE_FOLDER'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_SELECTED_FOLDER'; payload: Folder | null }
    | { type: 'SET_SELECTED_FOLDER_SOURCES'; payload: { folderId: number; sources: any[] } };

// Context value interface
interface FolderContextValue {
    folders: Folder[];
    isLoading: boolean;
    error: string | null;
    selectedFolder: Folder | null;
    selectedFolderSources: any[];
    fetchFolders: () => Promise<void>;
    getFolderById: (id: number) => Promise<void>;
    addFolder: (name: string, color: string) => Promise<Folder>;
    updateFolder: (folder: Folder) => void;
    deleteFolder: (id: number) => void;
    addSourceToFolder: (folderId: number, sourceId: number) => Promise<void>;
}

// State interface
interface FolderState {
    folders: Folder[];
    isLoading: boolean;
    error: string | null;
    selectedFolder: Folder | null;
    selectedFolderSources: any[];
}

// Initial state
const initialState: FolderState = {
    folders: [],
    isLoading: false,
    error: null,
    selectedFolder: null,
    selectedFolderSources: [],
};

// Reducer
const folderReducer = (state: FolderState, action: FolderAction): FolderState => {
    switch (action.type) {
        case 'SET_FOLDERS':
            return {
                ...state,
                folders: action.payload,
            };

        case 'ADD_FOLDER':
            return {
                ...state,
                folders: [action.payload, ...state.folders],
            };

        case 'UPDATE_FOLDER':
            return {
                ...state,
                folders: state.folders.map(folder =>
                    folder.id === action.payload.id ? action.payload : folder
                ),
            };

        case 'DELETE_FOLDER':
            return {
                ...state,
                folders: state.folders.filter(folder => folder.id !== action.payload),
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        case 'SET_SELECTED_FOLDER':
            return {
                ...state,
                selectedFolder: action.payload,
            };

        case 'SET_SELECTED_FOLDER_SOURCES':
            return {
                ...state,
                selectedFolderSources: action.payload.sources,
            };

        default:
            return state;
    }
};

// Create context
export const FolderContext = createContext<FolderContextValue | undefined>(undefined);

// Provider component
export const FolderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(folderReducer, initialState);

    // Fetch all folders
    const fetchFolders = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await folderService.getFolders();
            const mappedFolders = response.data.content.map(apiFolder =>
                mapApiToFolder(apiFolder)
            );
            dispatch({ type: 'SET_FOLDERS', payload: mappedFolders });
        } catch (error) {
            console.error('Error fetching folders:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch folders' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Get folder by ID
    const getFolderById = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await folderService.getFolderById(id);
            const folderWithSources = response.data;
            const mappedFolder = mapFolderWithSourcesToFolder(folderWithSources);

            dispatch({ type: 'SET_SELECTED_FOLDER', payload: mappedFolder });
            dispatch({
                type: 'SET_SELECTED_FOLDER_SOURCES',
                payload: { folderId: id, sources: folderWithSources.sources }
            });

            // Also update the folder in the folders list
            dispatch({ type: 'UPDATE_FOLDER', payload: mappedFolder });
        } catch (error) {
            console.error('Error fetching folder details:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch folder details' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Add a new folder
    const addFolder = useCallback(async (name: string, color: string): Promise<Folder> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const theme = getThemeFromColor(color);
            const response = await folderService.createFolder({ name, theme });
            const newFolder = mapApiToFolder(response.data);

            dispatch({ type: 'ADD_FOLDER', payload: newFolder });
            return newFolder;
        } catch (error) {
            console.error('Error creating folder:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to create folder' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Update folder (temporary mock)
    const updateFolder = useCallback((folder: Folder) => {
        dispatch({ type: 'UPDATE_FOLDER', payload: folder });
    }, []);

    // Delete folder (temporary mock)
    const deleteFolder = useCallback((id: number) => {
        dispatch({ type: 'DELETE_FOLDER', payload: id });
    }, []);

    // Add source to folder
    const addSourceToFolder = useCallback(async (folderId: number, sourceId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await folderService.addSourceToFolder(folderId, sourceId);
            const folderWithSources = response.data;
            const mappedFolder = mapFolderWithSourcesToFolder(folderWithSources);

            dispatch({ type: 'UPDATE_FOLDER', payload: mappedFolder });

            // If this is the currently selected folder, update its sources too
            if (state.selectedFolder && state.selectedFolder.id === folderId) {
                dispatch({ type: 'SET_SELECTED_FOLDER', payload: mappedFolder });
                dispatch({
                    type: 'SET_SELECTED_FOLDER_SOURCES',
                    payload: { folderId, sources: folderWithSources.sources }
                });
            }
        } catch (error) {
            console.error('Error adding source to folder:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add source to folder' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.selectedFolder]);

    // Load folders on mount
    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    const value: FolderContextValue = {
        folders: state.folders,
        isLoading: state.isLoading,
        error: state.error,
        selectedFolder: state.selectedFolder,
        selectedFolderSources: state.selectedFolderSources,
        fetchFolders,
        getFolderById,
        addFolder,
        updateFolder,
        deleteFolder,
        addSourceToFolder,
    };

    return (
        <FolderContext.Provider value={value}>
            {children}
        </FolderContext.Provider>
    );
};