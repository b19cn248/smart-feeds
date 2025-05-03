// src/components/features/layout/Sidebar/NavItem.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { NavItem as NavItemType } from '../../../../types';

const NavItemButton = styled.button<{ isActive?: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ isActive, theme }) =>
            isActive ? theme.colors.primary.light : 'transparent'};
    color: ${({ isActive, theme }) =>
            isActive ? theme.colors.primary.main : theme.colors.text.secondary};
    font-weight: ${({ isActive, theme }) =>
            isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    border: none;
    text-align: left;
    outline: none;
    -webkit-tap-highlight-color: transparent; // Loại bỏ highlight khi tap trên mobile

    &:hover, &:active, &:focus {
        background-color: ${({ isActive, theme }) =>
                isActive ? theme.colors.primary.light : theme.colors.gray[100]};
        color: ${({ isActive, theme }) =>
                isActive ? theme.colors.primary.main : theme.colors.text.primary};
    }

    @media (prefers-color-scheme: dark) {
        &:hover, &:active, &:focus {
            background-color: ${({ isActive, theme }) =>
                    isActive ? theme.colors.primary.light : theme.colors.gray[800]};
        }
    }

    i {
        margin-right: 12px;
        font-size: 16px;
        width: 20px;
        text-align: center;
    }
`;

interface NavItemProps {
    item: NavItemType;
    onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ item, onClick }) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        // Ngăn chặn event bubbling
        e.stopPropagation();

        // Gọi callback onClick trước
        if (onClick) {
            onClick();
        }

        // Sau đó mới chuyển trang
        if (item.path) {
            // Sử dụng setTimeout để đảm bảo UI có thời gian phản hồi trước khi chuyển trang
            setTimeout(() => {
                navigate(item.path || '/');
            }, 10);
        }
    };

    return (
        <NavItemButton
            isActive={item.isActive}
            onClick={handleClick}
            type="button" // Đặt type rõ ràng
        >
            <i className={`fas fa-${item.icon}`} />
            {item.label}
        </NavItemButton>
    );
};