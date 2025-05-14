// src/components/features/layout/Sidebar/Sidebar.tsx
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { NAV_SECTIONS } from '../../../../constants';
import { NavItem } from './NavItem';
import { css } from 'styled-components';

const SidebarWrapper = styled.div<{ isActive: boolean }>`
    width: 260px;
    background: ${({ theme }) => theme.colors.background.sidebarGradient}; /* Sử dụng giá trị từ theme */
    border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
    height: 100vh;
    position: fixed;
    overflow-y: auto;
    transition: ${({ theme }) => theme.transitions.default};
    padding: 24px 16px;
    z-index: ${({ theme }) => theme.zIndices.fixed + 10};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        transform: translateX(${({ isActive }) => isActive ? '0' : '-100%'});
        box-shadow: ${({ theme }) => theme.shadows.xl};
    }
`;

const Logo = styled.div`
    font-size: 22px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin-bottom: 32px;
    color: ${({ theme }) => theme.colors.logo};
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px;

    i {
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const NavSection = styled.div`
    margin-bottom: 24px;
`;

const NavSectionTitle = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.text.secondary};
    padding: 0 12px;
    margin-bottom: 12px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const NavList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

interface SidebarProps {
    isActive: boolean;
    onNavItemClick?: (itemId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isActive, onNavItemClick }) => {
    // Tham chiếu đến sidebar để đảm bảo focus khi active
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Focus vào sidebar khi nó được mở ra
    useEffect(() => {
        if (isActive && sidebarRef.current) {
            sidebarRef.current.focus();
        }
    }, [isActive]);

    const handleNavItemClick = (itemId: string) => {
        if (onNavItemClick) {
            onNavItemClick(itemId);
        }
    };

    return (
        <SidebarWrapper
            isActive={isActive}
            ref={sidebarRef}
            tabIndex={-1} // Cho phép focus nhưng không nằm trong tab order
        >
            <Logo>
                <i className="fas fa-rss" />
                Smart Feeds
            </Logo>

            {NAV_SECTIONS.map((section) => (
                <NavSection key={section.title}>
                    <NavSectionTitle>{section.title}</NavSectionTitle>
                    <NavList>
                        {section.items.map((item) => (
                            <NavItem
                                key={item.id}
                                item={item}
                                onClick={() => handleNavItemClick(item.id)}
                            />
                        ))}
                    </NavList>
                </NavSection>
            ))}
        </SidebarWrapper>
    );
};