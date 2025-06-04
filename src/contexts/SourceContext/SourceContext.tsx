// src/contexts/SourceContext/SourceContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { Source, CreateSourceRequest, UpdateSourceRequest } from '../../types';
import { sourceService } from '../../services';
import {
    debugApiResponse,
    validateSourceObject,
    debugArrayOperation,
    safeArrayFilter,
    debugSourceEditFlow
} from '../../utils/debugHelpers';

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
    getSourceById: (id: number) => Promise<Source | null>; // ✅ Ensure this is included
    addSource: (source: CreateSourceRequest) => Promise<void>;
    updateSource: (id: number, source: UpdateSourceRequest) => Promise<void>;
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

// Reducer với null safety và debug helpers
const sourceReducer = (state: SourceState, action: SourceAction): SourceState => {
    switch (action.type) {
        case 'SET_SOURCES':
            const beforeSources = state.sources;

            // Filter out null/invalid sources với validation
            const validSources = safeArrayFilter(action.payload, (source) =>
                validateSourceObject(source, 'SET_SOURCES')
            );

            debugArrayOperation('SET_SOURCES', beforeSources, validSources);

            return {
                ...state,
                sources: validSources
            };

        case 'ADD_SOURCE':
            // Validate source before adding
            if (!validateSourceObject(action.payload, 'ADD_SOURCE')) {
                console.error('Invalid source payload for ADD_SOURCE:', action.payload);
                return state;
            }

            const newSources = [action.payload, ...state.sources];
            debugArrayOperation('ADD_SOURCE', state.sources, newSources);

            return {
                ...state,
                sources: newSources
            };

        case 'UPDATE_SOURCE':
            // Validate source before updating
            if (!validateSourceObject(action.payload, 'UPDATE_SOURCE')) {
                console.error('Invalid source payload for UPDATE_SOURCE:', action.payload);
                return state;
            }

            const updatedSources = state.sources.map(source =>
                source && source.id === action.payload.id ? action.payload : source
            ).filter((source): source is Source => validateSourceObject(source, 'UPDATE_SOURCE filter'));

            debugArrayOperation('UPDATE_SOURCE', state.sources, updatedSources);

            return {
                ...state,
                sources: updatedSources
            };

        case 'DELETE_SOURCE':
            const filteredSources = state.sources.filter(source => source && source.id !== action.payload);
            debugArrayOperation('DELETE_SOURCE', state.sources, filteredSources);

            return {
                ...state,
                sources: filteredSources
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

    // Fetch all sources với debug logging
    const fetchSources = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await sourceService.getSources();

            // Debug API response
            debugApiResponse('GET /sources', response);

            // Validate response structure
            if (!response || !response.data || !Array.isArray(response.data.content)) {
                throw new Error('Invalid response structure from API');
            }

            dispatch({ type: 'SET_SOURCES', payload: response.data.content });
        } catch (error) {
            console.error('Error fetching sources:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sources';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // ✅ FIX: Enhanced getSourceById với debugging
    const getSourceById = useCallback(async (id: number): Promise<Source | null> => {
        try {
            if (!id || typeof id !== 'number') {
                throw new Error('Invalid source ID provided');
            }

            console.log(`🔍 Fetching source detail by ID: ${id}`);
            const response = await sourceService.getSourceById(id);

            // Debug API response
            debugApiResponse(`GET /sources/${id}`, response);

            // Enhanced validation với debug info
            if (!response) {
                throw new Error('No response received from API');
            }

            if (response.status < 200 || response.status >= 300) {
                throw new Error(`API returned error status: ${response.status} - ${response.message}`);
            }

            // Check if data exists
            if (!response.data) {
                console.warn(`⚠️ Source ${id} not found (data is null)`);
                return null;
            }

            // Validate source data
            if (!validateSourceObject(response.data, `getSourceById(${id})`)) {
                throw new Error('Invalid source data received from API');
            }

            console.log(`✅ Successfully fetched source ${id}:`, response.data);

            // ✅ FIX: Log categories info for debugging
            if (response.data.categories_ids) {
                console.log(`📂 Source ${id} has ${response.data.categories_ids.length} categories:`, response.data.categories_ids);
            } else {
                console.warn(`⚠️ Source ${id} has no categories_ids field`);
            }

            return response.data;
        } catch (error) {
            console.error(`❌ Error fetching source ${id}:`, error);
            throw error;
        }
    }, []);

    // Add new source - Cập nhật để xử lý category_ids
    const addSource = useCallback(async (newSource: CreateSourceRequest) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Validate input data
            if (!newSource.category_ids || !Array.isArray(newSource.category_ids) || newSource.category_ids.length === 0) {
                throw new Error('At least one category must be selected');
            }

            console.log('🚀 Creating source with categories:', newSource);

            // Gọi API để tạo source mới
            const response = await sourceService.createSource(newSource);

            // Debug API response
            debugApiResponse('POST /sources', response);

            // Validate response
            if (!response || typeof response.status !== 'number') {
                throw new Error('Invalid response from create source API');
            }

            // Check status
            if (response.status === 201 || (response.status >= 200 && response.status < 300)) {
                console.log('✅ Source created successfully with status:', response.status);

                // Fetch lại danh sách để lấy source mới được tạo
                await fetchSources();
            } else {
                throw new Error(`Create source failed with status: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Error adding source:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to add source';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchSources]);

    // Update existing source - Enhanced debugging
    const updateSource = useCallback(async (id: number, updatedSource: UpdateSourceRequest) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Validate input
            if (typeof id !== 'number' || !updatedSource) {
                throw new Error('Invalid parameters for update source');
            }

            // Validate categories
            if (!updatedSource.category_ids || !Array.isArray(updatedSource.category_ids) || updatedSource.category_ids.length === 0) {
                throw new Error('At least one category must be selected');
            }

            console.log('🔄 Updating source with categories:', id, updatedSource);

            // Gọi API để cập nhật source
            const response = await sourceService.updateSource(id, updatedSource);

            // Debug API response
            debugApiResponse('PUT /sources', response);

            // Validate response
            if (!response || typeof response.status !== 'number') {
                throw new Error('Invalid response from update source API');
            }

            // Check status
            if (response.status >= 200 && response.status < 300) {
                console.log('✅ Source updated successfully with status:', response.status);

                // Fetch lại danh sách để đảm bảo consistency
                await fetchSources();
            } else {
                throw new Error(`Update source failed with status: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Error updating source:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update source';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchSources]);

    // Delete source
    const deleteSource = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Validate input
            if (typeof id !== 'number') {
                throw new Error('Invalid source ID for deletion');
            }

            console.log('🗑️ Deleting source:', id);

            // Gọi API để xóa source
            const response = await sourceService.deleteSource(id);

            console.log('✅ Source deleted successfully');

            // Fetch lại danh sách để đảm bảo consistency
            await fetchSources();

        } catch (error) {
            console.error('❌ Error deleting source:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete source';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchSources]);

    // Lấy danh sách sources khi component mount
    useEffect(() => {
        console.log('📱 SourceProvider mounting, fetching sources...');
        fetchSources();
    }, [fetchSources]);

    // Debug state changes
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Sources state changed:', {
                count: state.sources.length,
                isLoading: state.isLoading,
                error: state.error
            });
        }
    }, [state.sources.length, state.isLoading, state.error]);

    const value: SourceContextValue = {
        sources: state.sources,
        isLoading: state.isLoading,
        error: state.error,
        fetchSources,
        getSourceById, // ✅ Ensure this is exported
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