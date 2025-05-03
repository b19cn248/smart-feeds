// src/components/features/layout/Header/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/Button';
import { iconButton } from '../../../../styles/mixins';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  z-index: ${({ theme }) => theme.zIndices.sticky};
  display: none;
  padding: 0 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-bottom-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ToggleButton = styled.button`
  ${iconButton}
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
    return (
        <HeaderWrapper>
            <ToggleButton onClick={onMenuClick} aria-label="Toggle menu">
                <i className="fas fa-bars" />
            </ToggleButton>

            <HeaderTitle>{title}</HeaderTitle>

            <HeaderActions>
                {rightActions}
            </HeaderActions>
        </HeaderWrapper>
    );
};