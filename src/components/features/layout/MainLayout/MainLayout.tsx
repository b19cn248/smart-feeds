// src/components/features/layout/MainLayout/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { useMediaQuery } from '../../../../hooks';
import { theme } from '../../../../styles/theme';
import { useLocation } from 'react-router-dom';
import { NotificationPanel } from '../../notifications/NotificationPanel';

const LayoutWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    position: relative;
`;

const MainContent = styled.main<{ hasPadding?: boolean }>`
    flex: 1;
    margin-left: 260px;
    transition: ${({ theme }) => theme.transitions.default};
    padding: ${({ hasPadding = true, theme }) => hasPadding ? theme.spacing['3xl'] : '0'};
    min-width: 0;
    padding-top: ${({ hasPadding, theme }) => hasPadding ? `calc(64px + ${theme.spacing['3xl']})` : '64px'};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        margin-left: 0;
    }
`;

// Điều chỉnh overlay để chỉ phủ phần content, không phủ sidebar
const Overlay = styled.div<{ isVisible: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 260px; // Để trống bên trái để không che phủ sidebar
    background-color: rgba(0, 0, 0, 0.5);
    z-index: ${({ theme }) => theme.zIndices.overlay};
    opacity: ${({ isVisible }) => isVisible ? 1 : 0};
    visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
    transition: ${({ theme }) => theme.transitions.default};
    pointer-events: ${({ isVisible }) => isVisible ? 'auto' : 'none'};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        left: 260px; // Vẫn giữ khoảng trống bên trái bằng đúng chiều rộng của sidebar
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
    const location = useLocation();

    // Đóng sidebar khi route thay đổi
    useEffect(() => {
        if (isMobile) {
            setSidebarActive(false);
        }
    }, [location, isMobile]);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    const closeSidebar = () => {
        setSidebarActive(false);
    };

    // Chặn scroll khi sidebar active trên mobile
    useEffect(() => {
        if (sidebarActive && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarActive, isMobile]);

    return (
        <LayoutWrapper>
            <Header
                title={headerTitle}
                onMenuClick={toggleSidebar}
                rightActions={headerActions}
            />

            <Sidebar
                isActive={sidebarActive}
                onNavItemClick={closeSidebar}
            />

            {/* Overlay chỉ che phần content, không che sidebar */}
            <Overlay
                isVisible={sidebarActive}
                onClick={closeSidebar}
            />

            <MainContent hasPadding={!noPadding}>
                {children}
            </MainContent>
            <NotificationPanel />
        </LayoutWrapper>
    );
};