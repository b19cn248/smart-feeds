// src/components/features/layout/Sidebar/NavItem.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này
import { NavItem as NavItemType } from '../../../../types';

const NavItemWrapper = styled.div<{ isActive?: boolean }>`
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    color: ${({ isActive, theme }) =>
            isActive ? theme.colors.primary.main : theme.colors.text.secondary};
    font-weight: ${({ isActive, theme }) =>
            isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    background-color: ${({ isActive, theme }) =>
            isActive ? theme.colors.primary.light : 'transparent'};

    &:hover {
        background-color: ${({ isActive, theme }) =>
                isActive ? theme.colors.primary.light : theme.colors.gray[100]};
        color: ${({ isActive, theme }) =>
                isActive ? theme.colors.primary.main : theme.colors.text.primary};
    }

    @media (prefers-color-scheme: dark) {
        &:hover {
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
    const navigate = useNavigate(); // Thêm dòng này

    const handleClick = () => {
        // Nếu có path, điều hướng đến path đó
        if (item.path) {
            navigate(item.path);
        }

        // Nếu có onClick callback thì gọi
        if (onClick) {
            onClick();
        }
    };

    return (
        <NavItemWrapper
            isActive={item.isActive}
            onClick={handleClick} // Sửa thành handleClick
            role="button"
            tabIndex={0}
        >
            <i className={`fas fa-${item.icon}`} />
            {item.label}
        </NavItemWrapper>
    );
};