// src/components/features/team/TeamList/TeamList.tsx
import React from 'react';
import styled from 'styled-components';
import { Team } from '../../../../types/team.types';
import { TeamCard } from '../TeamCard';
import { gridContainer } from '../../../../styles/mixins';

const TeamGrid = styled.div`
  ${gridContainer}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 24px;
`;

interface TeamListProps {
    teams: Team[];
    onTeamClick?: (teamId: number) => void;
    onViewMembers?: (teamId: number) => void;
    onAddMember?: (teamId: number) => void;
    searchQuery?: string;
}

export const TeamList: React.FC<TeamListProps> = ({
                                                      teams,
                                                      onTeamClick,
                                                      onViewMembers,
                                                      onAddMember,
                                                      searchQuery = ''
                                                  }) => {
    // Filter teams by search query
    const filteredTeams = searchQuery
        ? teams.filter(team =>
            team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : teams;

    if (filteredTeams.length === 0) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-users" />
                </EmptyStateIcon>
                <EmptyStateText>
                    {searchQuery
                        ? 'No teams found. Try a different search query.'
                        : 'No teams available. Create your first team!'}
                </EmptyStateText>
            </EmptyState>
        );
    }

    return (
        <TeamGrid>
            {filteredTeams.map(team => (
                <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => onTeamClick?.(team.id)}
                    onViewMembers={() => onViewMembers?.(team.id)}
                    onAddMember={() => onAddMember?.(team.id)}
                />
            ))}
        </TeamGrid>
    );
};