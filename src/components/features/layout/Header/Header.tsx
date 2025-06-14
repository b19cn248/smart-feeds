// src/components/features/layout/Header/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/Button';
import { iconButton } from '../../../../styles/mixins';
import { UserProfile } from '../Sidebar/UserProfile';
import { ThemeToggle } from "../../../../contexts/ThemeToggle";
import { useNotification } from '../../../../contexts/NotificationContext/NotificationContext';

const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    z-index: ${({ theme }) => theme.zIndices.sticky};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

const ToggleButton = styled.button`
    ${iconButton}
    display: none;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: flex;
    }
`;

const HeaderTitle = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    margin-left: 16px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        margin-left: 0;
    }
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const NotificationButton = styled.button`
    ${iconButton}
    position: relative;
`;

const NotificationBadge = styled.span`
    position: absolute;
    top: -2px;
    right: -2px;
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
    font-size: 10px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
`;

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
    rightActions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    onMenuClick,
    rightActions
}) => {
    const { unreadCount, toggleNotificationPanel } = useNotification();

    return (
        <HeaderWrapper>
            <LeftSection>
                <ToggleButton onClick={onMenuClick} aria-label="Toggle menu">
                    <i className="fas fa-bars" />
                </ToggleButton>

                <HeaderTitle>{title}</HeaderTitle>
            </LeftSection>

            <HeaderActions>
                <ThemeToggle />
                <NotificationButton onClick={toggleNotificationPanel} aria-label="Notifications">
                    <i className="fas fa-bell" />
                    {unreadCount > 0 && (
                        <NotificationBadge>{unreadCount}</NotificationBadge>
                    )}
                </NotificationButton>
                {rightActions}
                <UserProfile />
            </HeaderActions>
        </HeaderWrapper>
    );
};