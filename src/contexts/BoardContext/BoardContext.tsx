// src/contexts/BoardContext/BoardContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { Board, BoardCreateRequest, BoardUpdateRequest, AddArticleRequest, AddArticleFromUrlRequest } from '../../types';
import { boardService } from '../../services';

// Action types
type BoardAction =
    | { type: 'SET_BOARDS'; payload: Board[] }
    | { type: 'SET_TOTAL_PAGES'; payload: number }
    | { type: 'SET_CURRENT_PAGE'; payload: number }
    | { type: 'SET_SELECTED_BOARD'; payload: Board | null }
    | { type: 'ADD_BOARD'; payload: Board }
    | { type: 'UPDATE_BOARD'; payload: Board }
    | { type: 'DELETE_BOARD'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Context value interface
interface BoardContextValue {
    boards: Board[];
    selectedBoard: Board | null;
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    fetchBoards: (page?: number) => Promise<void>;
    getBoardById: (id: number) => Promise<void>;
    createBoard: (data: BoardCreateRequest) => Promise<Board>;
    updateBoard: (id: number, data: BoardUpdateRequest) => Promise<Board>;
    deleteBoard: (id: number) => Promise<void>;
    addArticleToBoard: (boardId: number, data: AddArticleRequest) => Promise<void>;
    addArticleFromUrlToBoard: (boardId: number, data: AddArticleFromUrlRequest) => Promise<void>;
    removeArticleFromBoard: (boardId: number, articleId: number) => Promise<void>;
}

// Initial state
interface BoardState {
    boards: Board[];
    selectedBoard: Board | null;
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: BoardState = {
    boards: [],
    selectedBoard: null,
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 0
};

// Reducer
const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
    switch (action.type) {
        case 'SET_BOARDS':
            return {
                ...state,
                boards: action.payload
            };
        case 'SET_TOTAL_PAGES':
            return {
                ...state,
                totalPages: action.payload
            };
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.payload
            };
        case 'SET_SELECTED_BOARD':
            return {
                ...state,
                selectedBoard: action.payload
            };
        case 'ADD_BOARD':
            return {
                ...state,
                boards: [action.payload, ...state.boards]
            };
        case 'UPDATE_BOARD':
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === action.payload.id ? action.payload : board
                ),
                selectedBoard: state.selectedBoard?.id === action.payload.id
                    ? action.payload
                    : state.selectedBoard
            };
        case 'DELETE_BOARD':
            return {
                ...state,
                boards: state.boards.filter(board => board.id !== action.payload),
                selectedBoard: state.selectedBoard?.id === action.payload
                    ? null
                    : state.selectedBoard
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
export const BoardContext = createContext<BoardContextValue | undefined>(undefined);

// Provider component
export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(boardReducer, initialState);

    // Fetch boards with pagination
    const fetchBoards = useCallback(async (page = 0) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await boardService.getBoards(page);
            dispatch({ type: 'SET_BOARDS', payload: response.data.content });
            dispatch({ type: 'SET_TOTAL_PAGES', payload: response.data.total_pages });
            dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
        } catch (error) {
            console.error('Error fetching boards:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch boards. Please try again.' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Get board by ID
    const getBoardById = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await boardService.getBoardById(id);
            dispatch({ type: 'SET_SELECTED_BOARD', payload: response.data });
        } catch (error) {
            console.error('Error fetching board details:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch board details. Please try again.' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Create board
    const createBoard = useCallback(async (data: BoardCreateRequest): Promise<Board> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await boardService.createBoard(data);
            const newBoard = response.data;
            dispatch({ type: 'ADD_BOARD', payload: newBoard });
            return newBoard;
        } catch (error) {
            console.error('Error creating board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to create board. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Update board
    const updateBoard = useCallback(async (id: number, data: BoardUpdateRequest): Promise<Board> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await boardService.updateBoard(id, data);
            const updatedBoard = response.data;
            dispatch({ type: 'UPDATE_BOARD', payload: updatedBoard });
            return updatedBoard;
        } catch (error) {
            console.error('Error updating board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update board. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Delete board
    const deleteBoard = useCallback(async (id: number): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await boardService.deleteBoard(id);
            dispatch({ type: 'DELETE_BOARD', payload: id });
        } catch (error) {
            console.error('Error deleting board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to delete board. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Add article to board
    const addArticleToBoard = useCallback(async (boardId: number, data: AddArticleRequest): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await boardService.addArticleToBoard(boardId, data);
            // Update the selected board if this is the current board
            if (state.selectedBoard?.id === boardId) {
                dispatch({ type: 'SET_SELECTED_BOARD', payload: response.data });
            }
        } catch (error) {
            console.error('Error adding article to board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add article to board. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.selectedBoard]);

    // Add article from URL to board
    const addArticleFromUrlToBoard = useCallback(async (boardId: number, data: AddArticleFromUrlRequest): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await boardService.addArticleFromUrlToBoard(boardId, data);
            // Update the selected board if this is the current board
            if (state.selectedBoard?.id === boardId) {
                dispatch({ type: 'SET_SELECTED_BOARD', payload: response.data });
            }
        } catch (error) {
            console.error('Error adding article from URL to board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add article from URL. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.selectedBoard]);

    // Remove article from board
    const removeArticleFromBoard = useCallback(async (boardId: number, articleId: number): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await boardService.removeArticleFromBoard(boardId, articleId);
            // If this is the currently selected board, refresh it
            if (state.selectedBoard?.id === boardId) {
                const response = await boardService.getBoardById(boardId);
                dispatch({ type: 'SET_SELECTED_BOARD', payload: response.data });
            }
        } catch (error) {
            console.error('Error removing article from board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to remove article from board. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.selectedBoard]);

    // Load boards on mount
    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    const value: BoardContextValue = {
        boards: state.boards,
        selectedBoard: state.selectedBoard,
        isLoading: state.isLoading,
        error: state.error,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        fetchBoards,
        getBoardById,
        createBoard,
        updateBoard,
        deleteBoard,
        addArticleToBoard,
        addArticleFromUrlToBoard,
        removeArticleFromBoard
    };

    return (
        <BoardContext.Provider value={value}>
            {children}
        </BoardContext.Provider>
    );
};