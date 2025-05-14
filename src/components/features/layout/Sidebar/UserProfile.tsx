// src/components/features/layout/Sidebar/UserProfile.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../../contexts/AuthContext';
import { useClickOutside } from '../../../../hooks';

const UserProfileWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const UserProfileButton = styled.button`
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.radii.full};
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }
`;

const UserAvatar = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #3e8ff2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 6px;
    max-width: 150px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: none;
    }
`;

const UserName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
`;

const UserEmail = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
`;

const ChevronIcon = styled.i<{ isOpen: boolean }>`
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: 12px;
    transition: transform 0.2s ease;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    flex-shrink: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: none;
    }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 220px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
    transition: ${({ theme }) => theme.transitions.default};
    z-index: ${({ theme }) => theme.zIndices.dropdown};
    overflow: hidden;
`;

const UserInfoHeader = styled.div`
    padding: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    display: none;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: block;
    }
`;

const MobileUserName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 4px;
`;

const MobileUserEmail = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const MenuItem = styled.button`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    text-align: left;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    i {
        width: 20px;
        margin-right: 12px;
        color: ${({ theme }) => theme.colors.gray[600]};
    }
`;

const Divider = styled.div`
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray[200]};
    margin: 4px 0;
`;

export const UserProfile: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

    // Lấy thông tin user từ Keycloak token
    const userName = user?.preferred_username || user?.name || 'User';
    const userEmail = user?.email || 'user@example.com';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    const menuItems = [
        {
            icon: 'user',
            label: 'Profile',
            onClick: () => {
                console.log('Navigate to profile');
                setIsOpen(false);
            },
        },
        {
            icon: 'cog',
            label: 'Settings',
            onClick: () => {
                console.log('Navigate to settings');
                setIsOpen(false);
            },
        },
        {
            icon: 'bell',
            label: 'Notifications',
            onClick: () => {
                console.log('Navigate to notifications');
                setIsOpen(false);
            },
        },
    ];

    return (
        <UserProfileWrapper ref={dropdownRef}>
            <UserProfileButton onClick={() => setIsOpen(!isOpen)}>
                <UserAvatar>{initials}</UserAvatar>
                <UserInfoContainer>
                    <UserName>{userName}</UserName>
                    <UserEmail>{userEmail}</UserEmail>
                </UserInfoContainer>
                <ChevronIcon className="fas fa-chevron-down" isOpen={isOpen} />
            </UserProfileButton>

            <DropdownMenu isOpen={isOpen}>
                <UserInfoHeader>
                    <MobileUserName>{userName}</MobileUserName>
                    <MobileUserEmail>{userEmail}</MobileUserEmail>
                </UserInfoHeader>

                {menuItems.map((item, index) => (
                    <MenuItem key={index} onClick={item.onClick}>
                        <i className={`fas fa-${item.icon}`} />
                        {item.label}
                    </MenuItem>
                ))}

                <Divider />

                <MenuItem onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" />
                    Logout
                </MenuItem>
            </DropdownMenu>
        </UserProfileWrapper>
    );
};