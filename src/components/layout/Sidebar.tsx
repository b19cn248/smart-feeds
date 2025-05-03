import React from 'react';
import styled from 'styled-components';

interface NavItem {
    icon: string;
    label: string;
    isActive?: boolean;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: 'Main',
        items: [
            { icon: 'home', label: 'Home' },
            { icon: 'compass', label: 'Discover' },
            { icon: 'folder', label: 'My Feeds', isActive: true },
            { icon: 'bookmark', label: 'Saved' },
        ],
    },
    {
        title: 'Personal',
        items: [
            { icon: 'heart', label: 'Favorites' },
            { icon: 'history', label: 'History' },
            { icon: 'bell', label: 'Notifications' },
        ],
    },
];

const SidebarWrapper = styled.div`
  width: 260px;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
  border-right: 1px solid var(--light-gray);
  height: 100vh;
  position: fixed;
  overflow-y: auto;
  transition: var(--transition);
  padding: 24px 16px;
  z-index: 10;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    box-shadow: var(--shadow-lg);
    
    &.active {
      transform: translateX(0);
    }
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
    border-right: 1px solid var(--light-gray);
  }
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;

  i {
    color: var(--primary);
  }
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const NavSectionTitle = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--dark-gray);
  padding: 0 12px;
  margin-bottom: 12px;
  font-weight: 600;
`;

const NavItemComponent = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--border-radius-sm);
  margin-bottom: 4px;
  color: ${props => props.isActive ? 'var(--primary)' : 'var(--text-secondary)'};
  font-weight: ${props => props.isActive ? '600' : '500'};
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  background-color: ${props => props.isActive ? 'var(--primary-light)' : 'transparent'};

  &:hover {
    background-color: ${props => props.isActive ? 'var(--primary-light)' : 'var(--light-gray)'};
    color: ${props => props.isActive ? 'var(--primary)' : 'var(--text-primary)'};
  }

  i {
    margin-right: 12px;
    font-size: 16px;
    width: 20px;
    text-align: center;
  }
`;

const SidebarFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0) 0%, #F8FAFC 30%);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, #0F172A 30%);
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: var(--border-radius);
  border: 1px solid var(--light-gray);
  background-color: white;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    border-color: var(--medium-gray);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1E293B;
    border-color: var(--light-gray);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--tertiary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
`;

const UserPlan = styled.div`
  font-size: 12px;
  color: var(--dark-gray);
`;

interface SidebarProps {
    isActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isActive }) => {
    return (
        <SidebarWrapper className={isActive ? 'active' : ''}>
            <Logo>
                <i className="fas fa-rss"></i>
                NewsSync
            </Logo>

            {navSections.map((section, index) => (
                <NavSection key={index}>
                    <NavSectionTitle>{section.title}</NavSectionTitle>
                    {section.items.map((item, itemIndex) => (
                        <NavItemComponent key={itemIndex} isActive={item.isActive}>
                            <i className={`fas fa-${item.icon}`}></i>
                            {item.label}
                        </NavItemComponent>
                    ))}
                </NavSection>
            ))}

            <SidebarFooter>
                <UserProfile>
                    <UserAvatar>TN</UserAvatar>
                    <UserInfo>
                        <UserName>T. Nguyen</UserName>
                        <UserPlan>Pro Plan</UserPlan>
                    </UserInfo>
                    <i className="fas fa-chevron-down" style={{ color: 'var(--dark-gray)', fontSize: '12px' }}></i>
                </UserProfile>
            </SidebarFooter>
        </SidebarWrapper>
    );
};

export default Sidebar;