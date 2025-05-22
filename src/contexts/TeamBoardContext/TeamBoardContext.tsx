// src/contexts/TeamBoardContext/TeamBoardContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { TeamBoard, TeamBoardDetail, TeamBoardNewsletterCreateRequest, TeamBoardNote, TeamBoardNotesResponse } from '../../types';
import { teamBoardService } from '../../services';
import { useToast } from '../ToastContext';
import { getArticleActionMessage } from '../../utils/notification.utils';

// Actions
type TeamBoardAction =
    | { type: 'SET_TEAM_BOARDS'; payload: TeamBoard[] }
    | { type: 'SET_TEAM_BOARD_DETAIL'; payload: TeamBoardDetail }
    | { type: 'ADD_TEAM_BOARD'; payload: TeamBoard }
    | { type: 'UPDATE_TEAM_BOARD'; payload: TeamBoard }
    | { type: 'DELETE_TEAM_BOARD'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_ARTICLE_NOTES'; payload: { articleId: number; notes: TeamBoardNote[] } };

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
    updateMemberPermission: (boardId: number, userId: number, email: string, permission: string) => Promise<boolean>;
    removeMember: (boardId: number, userId: number) => Promise<boolean>;
    createNewsletter: (
        boardId: number,
        title: string,
        recipients: string[],
        articleIds: number[],
        scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'IMMEDIATE'
    ) => Promise<boolean>;
    getArticleNotes: (boardId: number, articleId: number) => Promise<TeamBoardNotesResponse>;
    addArticleNote: (boardId: number, articleId: number, content: string, mentionedUserIds: number[]) => Promise<boolean>;
}

// Initial state
interface TeamBoardState {
    teamBoards: TeamBoard[];
    teamBoardDetail: TeamBoardDetail | null;
    isLoading: boolean;
    error: string | null;
    articleNotes: Record<number, TeamBoardNote[]>;
}

const initialState: TeamBoardState = {
    teamBoards: [],
    teamBoardDetail: null,
    isLoading: false,
    error: null,
    articleNotes: {}
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

        case 'SET_ARTICLE_NOTES':
            return {
                ...state,
                articleNotes: {
                    ...state.articleNotes,
                    [action.payload.articleId]: action.payload.notes
                }
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
            dispatch({ type: 'SET_TEAM_BOARD_DETAIL', payload: response.data });
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

            const newTeamBoard = response.data;
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

            const updatedTeamBoard = response.data;
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

    // Thêm phương thức updateMemberPermission
    const updateMemberPermission = useCallback(async (boardId: number, userId: number, email: string, permission: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await teamBoardService.updateMemberPermission(boardId, userId, {
                email,
                permission: permission as any
            });

            // Refresh board detail to get updated members
            if (state.teamBoardDetail && state.teamBoardDetail.id === boardId) {
                fetchTeamBoardDetail(boardId);
            }

            showToast('success', 'Success', 'Member permission updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating member permission:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update member permission' });
            showToast('error', 'Error', 'Failed to update member permission');
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchTeamBoardDetail, showToast, state.teamBoardDetail]);

    // Thêm phương thức removeMember
    const removeMember = useCallback(async (boardId: number, userId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await teamBoardService.removeMember(boardId, userId);

            // Refresh board detail to get updated members
            if (state.teamBoardDetail && state.teamBoardDetail.id === boardId) {
                fetchTeamBoardDetail(boardId);
            }

            showToast('success', 'Success', 'Member removed successfully');
            return true;
        } catch (error) {
            console.error('Error removing member:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to remove member' });
            showToast('error', 'Error', 'Failed to remove member');
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

    // Thêm hàm createNewsletter
    const createNewsletter = useCallback(async (
        boardId: number,
        title: string,
        recipients: string[],
        articleIds: number[],
        scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY' |  'IMMEDIATE'
    ) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            await teamBoardService.createNewsletter(boardId, {
                title,
                recipients,
                article_ids: articleIds,
                schedule_type: scheduleType
            });
            showToast('success', 'Success', 'Newsletter created successfully');
            return true;
        } catch (error) {
            console.error('Error creating newsletter:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to create newsletter' });
            showToast('error', 'Error', 'Failed to create newsletter');
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    // Add new note-related methods
    const getArticleNotes = useCallback(async (boardId: number, articleId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamBoardService.getArticleNotes(boardId, articleId);
            dispatch({ type: 'SET_ARTICLE_NOTES', payload: { articleId, notes: response.data } });
            return response;
        } catch (error) {
            console.error('Error fetching article notes:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch article notes' });
            showToast('error', 'Error', 'Failed to fetch article notes');
            return { status: 500, message: 'Error', data: [], timestamp: new Date().toISOString() };
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [showToast]);

    const addArticleNote = useCallback(async (boardId: number, articleId: number, content: string, mentionedUserIds: number[] = []) => {
        console.log('TeamBoardContext: addArticleNote called', { boardId, articleId, content, mentionedUserIds });
        
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            console.log('TeamBoardContext: Calling teamBoardService.addArticleNote');
            await teamBoardService.addArticleNote(boardId, articleId, content, mentionedUserIds);
            
            console.log('TeamBoardContext: Refreshing notes');
            const notes = await getArticleNotes(boardId, articleId);
            dispatch({ type: 'SET_ARTICLE_NOTES', payload: { articleId, notes: notes.data } });
            
            showToast('success', 'Success', 'Note added successfully');
            return true;
        } catch (error) {
            console.error('TeamBoardContext: Error adding article note:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add note' });
            showToast('error', 'Error', 'Failed to add note');
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [getArticleNotes, showToast]);

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
        removeArticleFromTeamBoard,
        updateMemberPermission,
        removeMember,
        createNewsletter,
        getArticleNotes,
        addArticleNote
    };

    return (
        <TeamBoardContext.Provider value={value}>
            {children}
        </TeamBoardContext.Provider>
    );
};