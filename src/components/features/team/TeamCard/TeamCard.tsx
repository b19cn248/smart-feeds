// src/components/features/team/TeamCard/TeamCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Team } from '../../../../types/team.types';
import { formatDate } from '../../../../utils';
import { Card } from '../../../common/Card';

const TeamContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TeamHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const TeamIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => `${theme.colors.primary.main}20`};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
        font-size: 18px;
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const TeamInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const TeamName = styled.h3`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0 0 4px 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TeamDescription = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    line-height: 1.5;
`;

const TeamMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    padding-top: 12px;
    margin-top: 10px;
`;

const TeamDate = styled.div``;

const TeamActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.text.primary};
    }
`;

interface TeamCardProps {
    team: Team;
    onClick?: () => void;
    onViewMembers?: (e: React.MouseEvent) => void;
    onAddMember?: (e: React.MouseEvent) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
                                                      team,
                                                      onClick,
                                                      onViewMembers,
                                                      onAddMember
                                                  }) => {
    const handleViewMembersClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onViewMembers) onViewMembers(e);
    };

    const handleAddMemberClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddMember) onAddMember(e);
    };

    return (
        <Card onClick={onClick}>
            <TeamContent>
                <TeamHeader>
                    <TeamIcon>
                        <i className="fas fa-users" />
                    </TeamIcon>
                    <TeamInfo>
                        <TeamName title={team.name}>{team.name}</TeamName>
                        <TeamDescription>{team.description || 'No description'}</TeamDescription>
                    </TeamInfo>
                </TeamHeader>

                <TeamMeta>
                    <TeamDate>{formatDate(new Date(team.created_at))}</TeamDate>
                    <TeamActions>
                        <ActionButton onClick={handleViewMembersClick} title="View members">
                            <i className="fas fa-user-friends" />
                        </ActionButton>
                        <ActionButton onClick={handleAddMemberClick} title="Add member">
                            <i className="fas fa-user-plus" />
                        </ActionButton>
                    </TeamActions>
                </TeamMeta>
            </TeamContent>
        </Card>
    );
};