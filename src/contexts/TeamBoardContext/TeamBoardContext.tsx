// src/contexts/TeamBoardContext/TeamBoardContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { TeamBoard, TeamBoardDetail } from '../../types';
import { teamBoardService } from '../../services';
import { useToast } from '../ToastContext';

// Actions
type TeamBoardAction =
    | { type: 'SET_TEAM_BOARDS'; payload: TeamBoard[] }
    | { type: 'SET_TEAM_BOARD_DETAIL'; payload: TeamBoardDetail }
    | { type: 'ADD_TEAM_BOARD'; payload: TeamBoard }
    | { type: 'UPDATE_TEAM_BOARD'; payload: TeamBoard }
    | { type: 'DELETE_TEAM_BOARD'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Context value interface
interface TeamBoardContextValue {
    teamBoards: TeamBoard[];
    teamBoardDetail: TeamBoardDetail | null;
    isLoading: boolean;
    error: string | null;
    fetchTeamBoards: () => Promise<void>;
    fetchTeamBoardsByTeam: (teamId: number) => Promise<void>;
    fetchTeamBoardDetail: (id: number) => Promise<void>;
    createTeamBoard: (name: string, description: string, teamId: number) => Promise<TeamBoard | null>;
    updateTeamBoard: (id: number, name: string, description: string, teamId: number) => Promise<TeamBoard | null>;
    deleteTeamBoard: (id: number) => Promise<boolean>;
    shareTeamBoard: (id: number, email: string, permission: string) => Promise<boolean>;
    addArticleToTeamBoard: (boardId: number, articleId: number) => Promise<boolean>;
    removeArticleFromTeamBoard: (boardId: number, articleId: number) => Promise<boolean>;
}

// Initial state
interface TeamBoardState {
    teamBoards: TeamBoard[];
    teamBoardDetail: TeamBoardDetail | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: TeamBoardState = {
    teamBoards: [],
    teamBoardDetail: null,
    isLoading: false,
    error: null
};

// Reducer
const teamBoardReducer = (state: TeamBoardState, action: TeamBoardAction): TeamBoardState => {
    switch (action.type) {
        case 'SET_TEAM_BOARDS':
            return {
                ...state,
                teamBoards: action.payload
            };

        case 'SET_TEAM_BOARD_DETAIL':
            return {
                ...state,
                teamBoardDetail: action.payload
            };

        case 'ADD_TEAM_BOARD':
            return {
                ...state,
                teamBoards: [action.payload, ...state.teamBoards]
            };

        case 'UPDATE_TEAM_BOARD':
            return {
                ...state,
                teamBoards: state.teamBoards.map(board =>
                    board.id === action.payload.id ? action.payload : board
                ),
                teamBoardDetail: state.teamBoardDetail && state.teamBoardDetail.id === action.payload.id
                    ? { ...state.teamBoardDetail, ...action.payload }
                    : state.teamBoardDetail
            };

        case 'DELETE_TEAM_BOARD':
            return {
                ...state,
                teamBoards: state.teamBoards.filter(board => board.id !== action.payload),
                teamBoardDetail: state.teamBoardDetail && state.teamBoardDetail.id === action.payload
                    ? null
                    : state.teamBoardDetail
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
export const TeamBoardContext = createContext<TeamBoardContextValue | undefined>(undefined);

// Provider component
export const TeamBoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(teamBoardReducer, initialState);
    const { showToast } = useToast();

    const fetchTeamBoards = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamBoardService.getTeamBoards();
            dispatch({ type: 'SET_TEAM_BOARDS', payload: response.data.content });
        } catch (error) {
            console.error('Error fetching team boards:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch team boards' });
            showToast('error', 'Error', 'Failed to fetch team boards');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    const fetchTeamBoardsByTeam = useCallback(async (teamId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamBoardService.getTeamBoardsByTeam(teamId);
            dispatch({ type: 'SET_TEAM_BOARDS', payload: response.data.content });
        } catch (error) {
            console.error('Error fetching team boards by team:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch team boards' });
            showToast('error', 'Error', 'Failed to fetch team boards');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    const fetchTeamBoardDetail = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamBoardService.getTeamBoardById(id);
            dispatch({ type: 'SET_TEAM_BOARD_DETAIL', payload: response.data.data });
        } catch (error) {
            console.error('Error fetching team board detail:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch team board detail' });
            showToast('error', 'Error', 'Failed to fetch team board detail');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    const createTeamBoard = useCallback(async (name: string, description: string, teamId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamBoardService.createTeamBoard({
                name,
                description,
                team_id: teamId
            });

            const newTeamBoard = response.data.data;
            dispatch({ type: 'ADD_TEAM_BOARD', payload: newTeamBoard });
            showToast('success', 'Success', 'Team board created successfully');
            return newTeamBoard;
        } catch (error) {
            console.error('Error creating team board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to create team board' });
            showToast('error', 'Error', 'Failed to create team board');
            return null;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    const updateTeamBoard = useCallback(async (id: number, name: string, description: string, teamId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamBoardService.updateTeamBoard(id, {
                name,
                description,
                team_id: teamId
            });

            const updatedTeamBoard = response.data.data;
            dispatch({ type: 'UPDATE_TEAM_BOARD', payload: updatedTeamBoard });
            showToast('success', 'Success', 'Team board updated successfully');
            return updatedTeamBoard;
        } catch (error) {
            console.error('Error updating team board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update team board' });
            showToast('error', 'Error', 'Failed to update team board');
            return null;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    const deleteTeamBoard = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await teamBoardService.deleteTeamBoard(id);
            dispatch({ type: 'DELETE_TEAM_BOARD', payload: id });
            showToast('success', 'Success', 'Team board deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting team board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to delete team board' });
            showToast('error', 'Error', 'Failed to delete team board');
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    const shareTeamBoard = useCallback(async (id: number, email: string, permission: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await teamBoardService.shareTeamBoard(id, {
                email,
                permission: permission as any
            });

            // Refresh board detail to get updated members
            if (state.teamBoardDetail && state.teamBoardDetail.id === id) {
                fetchTeamBoardDetail(id);
            }

            showToast('success', 'Success', 'Team board shared successfully');
            return true;
        } catch (error) {
            console.error('Error sharing team board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to share team board' });
            showToast('error', 'Error', 'Failed to share team board');
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchTeamBoardDetail, showToast, state.teamBoardDetail]);

    const addArticleToTeamBoard = useCallback(async (boardId: number, articleId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await teamBoardService.addArticleToTeamBoard(boardId, articleId);

            // Refresh board detail to get updated articles
            if (state.teamBoardDetail && state.teamBoardDetail.id === boardId) {
                fetchTeamBoardDetail(boardId);
            }

            showToast('success', 'Success', 'Article added to team board');
            return true;
        } catch (error) {
            console.error('Error adding article to team board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add article to team board' });
            showToast('error', 'Error', 'Failed to add article to team board');
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchTeamBoardDetail, showToast, state.teamBoardDetail]);

    const removeArticleFromTeamBoard = useCallback(async (boardId: number, articleId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await teamBoardService.removeArticleFromTeamBoard(boardId, articleId);

            // Refresh board detail to get updated articles
            if (state.teamBoardDetail && state.teamBoardDetail.id === boardId) {
                fetchTeamBoardDetail(boardId);
            }

            showToast('success', 'Success', 'Article removed from team board');
            return true;
        } catch (error) {
            console.error('Error removing article from team board:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to remove article from team board' });
            showToast('error', 'Error', 'Failed to remove article from team board');
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchTeamBoardDetail, showToast, state.teamBoardDetail]);

    // Fetch team boards when component mounts
    useEffect(() => {
        fetchTeamBoards();
    }, [fetchTeamBoards]);

    const value: TeamBoardContextValue = {
        teamBoards: state.teamBoards,
        teamBoardDetail: state.teamBoardDetail,
        isLoading: state.isLoading,
        error: state.error,
        fetchTeamBoards,
        fetchTeamBoardsByTeam,
        fetchTeamBoardDetail,
        createTeamBoard,
        updateTeamBoard,
        deleteTeamBoard,
        shareTeamBoard,
        addArticleToTeamBoard,
        removeArticleFromTeamBoard
    };

    return (
        <TeamBoardContext.Provider value={value}>
            {children}
        </TeamBoardContext.Provider>
    );
};