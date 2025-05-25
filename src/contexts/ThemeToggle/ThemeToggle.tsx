// src/contexts/ThemeToggle/ThemeToggle.tsx
import React from 'react';
import styled from 'styled-components';
import { useThemeContext } from "../ThemeContext";

const ToggleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.background.secondary};
    }
`;

export const ThemeToggle: React.FC = () => {
    const { resolvedTheme, toggleTheme } = useThemeContext();

    return (
        <ToggleButton onClick={toggleTheme} aria-label="Toggle theme">
            {resolvedTheme === 'dark' ? (
                <i className="fas fa-sun" />
            ) : (
                <i className="fas fa-moon" />
            )}
        </ToggleButton>
    );
};