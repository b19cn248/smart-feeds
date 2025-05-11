import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
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
    -webkit-tap-highlight-color: transparent;

    /* Thêm indicator bên trái khi active để tăng tính nổi bật */
    ${({ isActive, theme }) => isActive && css`
        box-shadow: inset 3px 0 0 ${theme.colors.primary.main};
    `}

        /* Style riêng cho dark mode */
    ${({ isActive, theme }) => theme.colors.background.primary === '#0F172A' && css`
        &:hover {
            background-color: ${isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
        }
    `}

    &:hover, &:active, &:focus {
        background-color: ${({ isActive, theme }) =>
                isActive ? theme.colors.primary.light : theme.colors.gray[100]};
        color: ${({ isActive, theme }) =>
                isActive ? theme.colors.primary.main : theme.colors.text.primary};
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
    const location = useLocation();

    // Kiểm tra xem item có đang active hay không dựa vào đường dẫn hiện tại
    const isActive = item.path === '/'
        ? location.pathname === '/'
        : Boolean(item.path && location.pathname.startsWith(item.path));

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
            isActive={isActive}
            onClick={handleClick}
            type="button"
        >
            <i className={`fas fa-${item.icon}`} />
            {item.label}
        </NavItemButton>
    );
};