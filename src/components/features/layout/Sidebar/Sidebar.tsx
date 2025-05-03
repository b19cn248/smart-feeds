// src/components/features/layout/Sidebar/Sidebar.tsx
import React from 'react';
import styled from 'styled-components';
import { NAV_SECTIONS } from '../../../../constants';
import { NavItem } from './NavItem';
import { UserProfile } from './UserProfile';
import { gradientBackground } from '../../../../styles/mixins';
import { css } from 'styled-components';

const SidebarWrapper = styled.div<{ isActive: boolean }>`
    width: 260px;
    ${gradientBackground}
    ${({ theme }) => css`
    border-right: 1px solid ${theme.colors.gray[200]};
  `}
    height: 100vh;
    position: fixed;
    overflow-y: auto;
    transition: ${({ theme }) => theme.transitions.default};
    padding: 24px 16px;
    z-index: ${({ theme }) => theme.zIndices.fixed};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        transform: translateX(${({ isActive }) => isActive ? '0' : '-100%'});
        box-shadow: ${({ theme }) => theme.shadows.xl};
    }

    @media (prefers-color-scheme: dark) {
        ${({ theme }) => css`
      border-right-color: ${theme.colors.gray[700]};
    `}
    }
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.text.primary};
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

const SidebarFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(180deg, transparent 0%, ${({ theme }) => theme.colors.background.primary} 30%);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, transparent 0%, #0F172A 30%);
  }
`;

interface SidebarProps {
    isActive: boolean;
    onNavItemClick?: (itemId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isActive, onNavItemClick }) => {
    return (
        <SidebarWrapper isActive={isActive}>
            <Logo>
                <i className="fas fa-rss" />
                NewsSync
            </Logo>

            {NAV_SECTIONS.map((section) => (
                <NavSection key={section.title}>
                    <NavSectionTitle>{section.title}</NavSectionTitle>
                    <NavList>
                        {section.items.map((item) => (
                            <NavItem
                                key={item.id}
                                item={item}
                                onClick={() => onNavItemClick?.(item.id)}
                            />
                        ))}
                    </NavList>
                </NavSection>
            ))}

            <SidebarFooter>
                <UserProfile />
            </SidebarFooter>
        </SidebarWrapper>
    );
};

