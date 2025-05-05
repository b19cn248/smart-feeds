// src/contexts/SourceContext/SourceContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode, useEffect, useState } from 'react';
import { Source } from '../../types';
import { sourceService } from '../../services';

// Action types
type SourceAction =
    | { type: 'SET_SOURCES'; payload: Source[] }
    | { type: 'ADD_SOURCE'; payload: Source }
    | { type: 'UPDATE_SOURCE'; payload: Source }
    | { type: 'DELETE_SOURCE'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Context value interface
interface SourceContextValue {
    sources: Source[];
    isLoading: boolean;
    error: string | null;
    fetchSources: () => Promise<void>;
    addSource: (source: Omit<Source, 'id'>) => Promise<void>;
    updateSource: (source: Source) => Promise<void>;
    deleteSource: (id: number) => Promise<void>;
}

// Initial state
interface SourceState {
    sources: Source[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SourceState = {
    sources: [],
    isLoading: false,
    error: null
};

// Reducer
const sourceReducer = (state: SourceState, action: SourceAction): SourceState => {
    switch (action.type) {
        case 'SET_SOURCES':
            return {
                ...state,
                sources: action.payload
            };

        case 'ADD_SOURCE':
            return {
                ...state,
                sources: [action.payload, ...state.sources]
            };

        case 'UPDATE_SOURCE':
            return {
                ...state,
                sources: state.sources.map(source =>
                    source.id === action.payload.id ? action.payload : source
                )
            };

        case 'DELETE_SOURCE':
            return {
                ...state,
                sources: state.sources.filter(source => source.id !== action.payload)
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
};

// Create context
export const SourceContext = createContext<SourceContextValue | undefined>(undefined);

// Provider component
export const SourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(sourceReducer, initialState);

    const fetchSources = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await sourceService.getSources();
            dispatch({ type: 'SET_SOURCES', payload: response.data.content });
        } catch (error) {
            console.error('Error fetching sources:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch sources' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const addSource = useCallback(async (newSource: Omit<Source, 'id'>) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Mô phỏng API call để thêm source
            // Trong thực tế, bạn sẽ gọi API backend ở đây
            const fakeId = Math.floor(Math.random() * 1000);
            const source: Source = {
                id: fakeId,
                ...newSource as any,
                created_at: new Date().toISOString()
            };

            dispatch({ type: 'ADD_SOURCE', payload: source });

            // Sau khi thêm thành công, fetch lại danh sách để đồng bộ với server
            await fetchSources();
        } catch (error) {
            console.error('Error adding source:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add source' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchSources]);

    const updateSource = useCallback(async (updatedSource: Source) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Mô phỏng API call để cập nhật source
            // Trong thực tế, bạn sẽ gọi API backend ở đây
            dispatch({ type: 'UPDATE_SOURCE', payload: updatedSource });

            // Sau khi cập nhật thành công, fetch lại danh sách để đồng bộ với server
            await fetchSources();
        } catch (error) {
            console.error('Error updating source:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update source' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchSources]);

    const deleteSource = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Mô phỏng API call để xóa source
            // Trong thực tế, bạn sẽ gọi API backend ở đây
            dispatch({ type: 'DELETE_SOURCE', payload: id });

            // Sau khi xóa thành công, fetch lại danh sách để đồng bộ với server
            await fetchSources();
        } catch (error) {
            console.error('Error deleting source:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to delete source' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchSources]);

    // Lấy danh sách sources khi component mount
    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    const value: SourceContextValue = {
        sources: state.sources,
        isLoading: state.isLoading,
        error: state.error,
        fetchSources,
        addSource,
        updateSource,
        deleteSource
    };

    return (
        <SourceContext.Provider value={value}>
            {children}
        </SourceContext.Provider>
    );
};