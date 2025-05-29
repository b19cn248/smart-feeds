// src/components/features/team/TeamMemberList/TeamMemberList.tsx
import React from 'react';
import styled from 'styled-components';
import { TeamMember } from '../../../../types/team.types';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { useAuth } from '../../../../contexts/AuthContext';

const MemberList = styled.div`
    display: flex;
    flex-direction: column;
`;

const MemberItem = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[50]};
    }

    &:last-child {
        border-bottom: none;
    }
`;

const MemberAvatar = styled.div<{ isCurrentUser?: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme, isCurrentUser }) =>
            isCurrentUser ? theme.colors.primary.main : theme.colors.primary.light};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    color: ${({ theme, isCurrentUser }) =>
            isCurrentUser ? 'white' : theme.colors.primary.main};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const MemberInfo = styled.div`
    flex: 1;
`;

const MemberName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 8px;
`;

const CurrentUserBadge = styled.span`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
    padding: 2px 6px;
    border-radius: ${({ theme }) => theme.radii.full};
`;

const MemberEmail = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const MemberRole = styled.div<{ role: string }>`
    display: inline-block;
    padding: 2px 8px;
    background-color: ${({ theme, role }) =>
    role === 'ADMIN'
        ? `${theme.colors.primary.main}10`
        : `${theme.colors.gray[500]}10`
};
    color: ${({ theme, role }) =>
    role === 'ADMIN'
        ? theme.colors.primary.main
        : theme.colors.text.secondary
};
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    margin-left: 8px;
`;

const MemberActions = styled.div`
    display: flex;
    gap: 8px;
    margin-left: 12px;
    opacity: 0;
    transition: opacity 0.2s ease;
    
    ${MemberItem}:hover & {
        opacity: 1;
    }
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: pointer;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
    transition: ${({ theme }) => theme.transitions.fast};
    
    &:hover {
        color: ${({ theme }) => theme.colors.error};
        background-color: ${({ theme }) => `${theme.colors.error}10`};
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const EmptyList = styled.div`
    text-align: center;
    padding: 32px 16px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

interface TeamMemberListProps {
    members: TeamMember[];
    isLoading?: boolean;
    onRemoveMember?: (member: TeamMember) => void;
    teamId?: number;
}

export const TeamMemberList: React.FC<TeamMemberListProps> = ({
                                                                  members,
                                                                  isLoading = false,
                                                                  onRemoveMember,
                                                                  teamId
                                                              }) => {
    const { user } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (members.length === 0) {
        return <EmptyList>No members in this team yet.</EmptyList>;
    }

    // Helper to get initials from name
    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Get current user's email from auth context
    const currentUserEmail = user?.email;

    // Check if the current user is an admin in this team
    const isCurrentUserAdmin = members.some(
        member => member.email === currentUserEmail && member.role === 'ADMIN'
    );

    return (
        <MemberList>
            {members.map(member => {
                const isCurrentUser = member.email === currentUserEmail;
                const isAdmin = member.role === 'ADMIN';

                // Only admins can remove members, and admins can't be removed
                const canRemove = isCurrentUserAdmin && !isAdmin && !isCurrentUser;

                return (
                    <MemberItem key={member.id}>
                        <MemberAvatar isCurrentUser={isCurrentUser}>
                            {getInitials(member.name)}
                        </MemberAvatar>
                        <MemberInfo>
                            <MemberName>
                                {member.name}
                                {isCurrentUser && (
                                    <CurrentUserBadge>You</CurrentUserBadge>
                                )}
                            </MemberName>
                            <MemberEmail>{member.email}</MemberEmail>
                        </MemberInfo>
                        <MemberRole role={member.role}>
                            {member.role}
                        </MemberRole>

                        {onRemoveMember && canRemove && (
                            <MemberActions>
                                <ActionButton
                                    onClick={() => onRemoveMember(member)}
                                    title="Remove member"
                                >
                                    <i className="fas fa-user-minus" />
                                </ActionButton>
                            </MemberActions>
                        )}
                    </MemberItem>
                );
            })}
        </MemberList>
    );
};