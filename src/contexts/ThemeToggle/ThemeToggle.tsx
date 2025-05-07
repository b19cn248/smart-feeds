// src/components/common/ThemeToggle/ThemeToggle.tsx
import React from 'react';
import styled from 'styled-components';
import {useThemeContext} from "../ ThemeContext";

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
  
  i {
    font-size: 18px;
  }
`;

export const ThemeToggle: React.FC = () => {
    const { resolvedTheme, toggleTheme } = useThemeContext();

    return (
        <ToggleButton
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
        >
            <i className={`fas fa-${resolvedTheme === 'light' ? 'moon' : 'sun'}`} />
        </ToggleButton>
    );
};