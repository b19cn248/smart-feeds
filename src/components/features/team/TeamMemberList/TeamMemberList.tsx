// src/components/features/team/TeamMemberList/TeamMemberList.tsx
import React from 'react';
import styled from 'styled-components';
import { TeamMember } from '../../../../types/team.types';
import { LoadingScreen } from '../../../common/LoadingScreen';

const MemberList = styled.div`
    display: flex;
    flex-direction: column;
`;

const MemberItem = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

    &:last-child {
        border-bottom: none;
    }

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

const MemberAvatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary.light};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const MemberInfo = styled.div`
    flex: 1;
`;

const MemberName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
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

const EmptyList = styled.div`
    text-align: center;
    padding: 32px 16px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

interface TeamMemberListProps {
    members: TeamMember[];
    isLoading?: boolean;
}

export const TeamMemberList: React.FC<TeamMemberListProps> = ({
                                                                  members,
                                                                  isLoading = false
                                                              }) => {
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

    return (
        <MemberList>
            {members.map(member => (
                <MemberItem key={member.id}>
                    <MemberAvatar>
                        {getInitials(member.name)}
                    </MemberAvatar>
                    <MemberInfo>
                        <MemberName>{member.name}</MemberName>
                        <MemberEmail>{member.email}</MemberEmail>
                    </MemberInfo>
                    <MemberRole role={member.role}>
                        {member.role}
                    </MemberRole>
                </MemberItem>
            ))}
        </MemberList>
    );
};