// src/contexts/TeamBoardContext/useTeamBoard.ts
import { useContext } from 'react';
import { TeamBoardContext } from './TeamBoardContext';

export const useTeamBoard = () => {
    const context = useContext(TeamBoardContext);

    if (!context) {
        throw new Error('useTeamBoard must be used within a TeamBoardProvider');
    }

    return context;
};