// src/components/features/layout/Sidebar/UserProfile.tsx
import React from 'react';
import styled from 'styled-components';

const UserProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[300]};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UserPlan = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ChevronIcon = styled.i`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 12px;
`;

export const UserProfile: React.FC = () => {
    return (
        <UserProfileWrapper>
            <UserAvatar>TN</UserAvatar>
            <UserInfo>
                <UserName>T. Nguyen</UserName>
                <UserPlan>Pro Plan</UserPlan>
            </UserInfo>
            <ChevronIcon className="fas fa-chevron-down" />
        </UserProfileWrapper>
    );
};