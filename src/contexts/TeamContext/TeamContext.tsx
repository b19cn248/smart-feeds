// src/contexts/TeamContext/TeamContext.tsx
import React, { createContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { Team, TeamCreateRequest, AddTeamMemberRequest, TeamMember, TeamContextValue } from '../../types/team.types';
import { teamService } from '../../services/teamService';

// Action types
type TeamAction =
    | { type: 'SET_TEAMS'; payload: Team[] }
    | { type: 'SET_TOTAL_PAGES'; payload: number }
    | { type: 'SET_CURRENT_PAGE'; payload: number }
    | { type: 'SET_SELECTED_TEAM'; payload: Team | null }
    | { type: 'SET_TEAM_MEMBERS'; payload: TeamMember[] }
    | { type: 'ADD_TEAM'; payload: Team }
    | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
    | { type: 'REMOVE_TEAM_MEMBER'; payload: { memberId: number } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Initial state
interface TeamState {
    teams: Team[];
    selectedTeam: Team | null;
    teamMembers: TeamMember[];
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: TeamState = {
    teams: [],
    selectedTeam: null,
    teamMembers: [],
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 0
};

// Reducer
const teamReducer = (state: TeamState, action: TeamAction): TeamState => {
    switch (action.type) {
        case 'SET_TEAMS':
            return {
                ...state,
                teams: action.payload
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
        case 'SET_SELECTED_TEAM':
            return {
                ...state,
                selectedTeam: action.payload
            };
        case 'SET_TEAM_MEMBERS':
            return {
                ...state,
                teamMembers: action.payload
            };
        case 'ADD_TEAM':
            return {
                ...state,
                teams: [action.payload, ...state.teams]
            };
        case 'ADD_TEAM_MEMBER':
            return {
                ...state,
                teamMembers: [...state.teamMembers, action.payload]
            };
        case 'REMOVE_TEAM_MEMBER':
            return {
                ...state,
                teamMembers: state.teamMembers.filter(member => member.user_id !== action.payload.memberId)
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
export const TeamContext = createContext<TeamContextValue | undefined>(undefined);

// Provider component
export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(teamReducer, initialState);

    // Fetch teams with pagination
    const fetchTeams = useCallback(async (page = 0) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamService.getTeams(page);
            dispatch({ type: 'SET_TEAMS', payload: response.data.content });
            dispatch({ type: 'SET_TOTAL_PAGES', payload: response.data.total_pages });
            dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
        } catch (error) {
            console.error('Error fetching teams:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch teams. Please try again.' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Fetch team members
    const fetchTeamMembers = useCallback(async (teamId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamService.getTeamMembers(teamId);
            dispatch({ type: 'SET_TEAM_MEMBERS', payload: response.data });
        } catch (error) {
            console.error('Error fetching team members:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch team members. Please try again.' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Select a team
    const selectTeam = useCallback((team: Team) => {
        dispatch({ type: 'SET_SELECTED_TEAM', payload: team });
        // Khi chọn team, tự động load danh sách thành viên
        fetchTeamMembers(team.id);
    }, [fetchTeamMembers]);

    // Create team
    const createTeam = useCallback(async (data: TeamCreateRequest): Promise<Team> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamService.createTeam(data);
            const newTeam = response.data;
            dispatch({ type: 'ADD_TEAM', payload: newTeam });
            return newTeam;
        } catch (error) {
            console.error('Error creating team:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to create team. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Add team member
    const addTeamMember = useCallback(async (teamId: number, data: AddTeamMemberRequest): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await teamService.addTeamMember(teamId, data);
            dispatch({ type: 'ADD_TEAM_MEMBER', payload: response.data });

            // Refresh thành viên sau khi thêm
            await fetchTeamMembers(teamId);
        } catch (error) {
            console.error('Error adding team member:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add team member. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchTeamMembers]);

    // Remove team member
    const removeTeamMember = useCallback(async (teamId: number, memberId: number): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            await teamService.removeTeamMember(teamId, memberId);
            dispatch({ type: 'REMOVE_TEAM_MEMBER', payload: { memberId } });
        } catch (error) {
            console.error('Error removing team member:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to remove team member. Please try again.' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Load teams on mount
    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const value: TeamContextValue = {
        teams: state.teams,
        selectedTeam: state.selectedTeam,
        teamMembers: state.teamMembers,
        isLoading: state.isLoading,
        error: state.error,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        fetchTeams,
        selectTeam,
        createTeam,
        addTeamMember,
        fetchTeamMembers,
        removeTeamMember
    };

    return (
        <TeamContext.Provider value={value}>
            {children}
        </TeamContext.Provider>
    );
};