// src/components/features/teamBoard/TeamMemberList/TeamMemberList.tsx
import React from 'react';
import styled from 'styled-components';
import { TeamBoardUser } from '../../../../types';

const MembersContainer = styled.div`
    margin-top: 16px;
`;

const MemberRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

    &:last-child {
        border-bottom: none;
    }

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const MemberInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const MemberAvatar = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.primary.main};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: 14px;
`;

const MemberDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

const MemberName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const MemberEmail = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const MemberActions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const PermissionBadge = styled.div<{ permission: string }>`
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    background-color: ${({ permission, theme }) =>
    permission === 'ADMIN'
        ? `${theme.colors.error}20`
        : permission === 'EDIT'
            ? `${theme.colors.primary.main}20`
            : `${theme.colors.gray[500]}20`
};
    color: ${({ permission, theme }) =>
    permission === 'ADMIN'
        ? theme.colors.error
        : permission === 'EDIT'
            ? theme.colors.primary.main
            : theme.colors.text.secondary
};
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: pointer;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        color: ${({ theme }) => theme.colors.error};
        background-color: ${({ theme }) => theme.colors.error}10;
    }
`;

interface TeamMemberListProps {
    members: TeamBoardUser[];
    currentUserId?: number;
    onRemoveMember?: (userId: number) => void;
    onEditPermission?: (userId: number) => void;
}

export const TeamMemberList: React.FC<TeamMemberListProps> = ({
                                                                  members,
                                                                  currentUserId,
                                                                  onRemoveMember,
                                                                  onEditPermission
                                                              }) => {
    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <MembersContainer>
            {members.map(member => (
                <MemberRow key={member.id}>
                    <MemberInfo>
                        <MemberAvatar>
                            {getInitials(member.name)}
                        </MemberAvatar>
                        <MemberDetails>
                            <MemberName>{member.name}</MemberName>
                            <MemberEmail>{member.email}</MemberEmail>
                        </MemberDetails>
                    </MemberInfo>
                    <MemberActions>
                        <PermissionBadge permission={member.permission}>
                            {member.permission}
                        </PermissionBadge>

                        {/* Don't allow removing yourself or admin if not admin */}
                        {member.user_id !== currentUserId && member.permission !== 'ADMIN' && (
                            <>
                                <ActionButton
                                    onClick={() => onEditPermission?.(member.user_id)}
                                    title="Edit permission"
                                >
                                    <i className="fas fa-edit" />
                                </ActionButton>
                                <ActionButton
                                    onClick={() => onRemoveMember?.(member.user_id)}
                                    title="Remove member"
                                >
                                    <i className="fas fa-times" />
                                </ActionButton>
                            </>
                        )}
                    </MemberActions>
                </MemberRow>
            ))}
        </MembersContainer>
    );
};