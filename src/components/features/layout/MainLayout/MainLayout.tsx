// src/components/features/layout/MainLayout/MainLayout.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { useMediaQuery } from '../../../../hooks';
import { theme } from '../../../../styles/theme';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main<{ hasPadding?: boolean }>`
  flex: 1;
  margin-left: 260px;
  transition: ${({ theme }) => theme.transitions.default};
  padding: ${({ hasPadding = true, theme }) => hasPadding ? theme.spacing['3xl'] : '0'};
  min-width: 0; // Prevents flex items from overflowing

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    padding-top: ${({ hasPadding, theme }) => hasPadding ? `calc(64px + ${theme.spacing['3xl']})` : '64px'};
  }
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndices.overlay};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  transition: ${({ theme }) => theme.transitions.default};
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

interface MainLayoutProps {
    children: React.ReactNode;
    headerTitle?: string;
    headerActions?: React.ReactNode;
    noPadding?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
                                                          children,
                                                          headerTitle = 'NewsSync',
                                                          headerActions,
                                                          noPadding = false
                                                      }) => {
    const [sidebarActive, setSidebarActive] = useState(false);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    const closeSidebar = () => {
        setSidebarActive(false);
    };

    return (
        <LayoutWrapper>
            <Header
                title={headerTitle}
                onMenuClick={toggleSidebar}
                rightActions={headerActions}
            />

            <Sidebar
                isActive={sidebarActive}
                onNavItemClick={isMobile ? closeSidebar : undefined}
            />

            <MainContent hasPadding={!noPadding}>
                {children}
            </MainContent>

            <Overlay
                isVisible={sidebarActive}
                onClick={closeSidebar}
            />
        </LayoutWrapper>
    );
};
