// src/components/features/layout/Sidebar/UserProfile.tsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../../contexts/AuthContext';
import { useClickOutside } from '../../../../hooks';

const UserProfileWrapper = styled.div`
  position: relative;
`;

const UserProfileButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
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
  text-align: left;
`;

const UserName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const UserEmail = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const ChevronIcon = styled.i<{ isOpen: boolean }>`
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: 12px;
    transition: transform 0.2s ease;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: ${({ theme }) => theme.transitions.default};
  z-index: 1000;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: left;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  i {
    width: 20px;
    margin-right: 12px;
    color: ${({ theme }) => theme.colors.gray[600]};
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[700]};
    }

    i {
      color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;

const Divider = styled.div`
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray[200]};
    margin: 4px 0;

    @media (prefers-color-scheme: dark) {
        background-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

export const UserProfile: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const dropdownRef = useClickOutside(() => setIsOpen(false));

    // Lấy thông tin user từ Keycloak token
    const userName = user?.preferred_username || user?.name || 'User';
    const userEmail = user?.email || '';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = () => {
        logout();
    };

    const menuItems = [
        {
            icon: 'user',
            label: 'Profile',
            onClick: () => {
                // Navigate to profile page
                console.log('Navigate to profile');
                setIsOpen(false);
            },
        },
        {
            icon: 'cog',
            label: 'Settings',
            onClick: () => {
                // Navigate to settings page
                console.log('Navigate to settings');
                setIsOpen(false);
            },
        },
        {
            icon: 'bell',
            label: 'Notifications',
            onClick: () => {
                // Navigate to notifications page
                console.log('Navigate to notifications');
                setIsOpen(false);
            },
        },
    ];

    return (
        <UserProfileWrapper ref={dropdownRef}>
            <UserProfileButton onClick={() => setIsOpen(!isOpen)}>
                <UserAvatar>{initials}</UserAvatar>
                <UserInfo>
                    <UserName>{userName}</UserName>
                    <UserEmail>{userEmail}</UserEmail>
                </UserInfo>
                <ChevronIcon className="fas fa-chevron-down" isOpen={isOpen} />
            </UserProfileButton>

            <DropdownMenu isOpen={isOpen}>
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