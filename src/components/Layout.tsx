import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './layout/Sidebar';
import MainContent from './layout/MainContent';
import Toast from './toast/Toast';
import { useToast } from '../context/ToastContext';

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ToggleButton = styled.button`
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: var(--shadow);
  border: none;
  z-index: 20;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 16px;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1E293B;
    color: white;
  }
`;

const Layout: React.FC = () => {
    const [sidebarActive, setSidebarActive] = useState(false);
    const { toast, hideToast } = useToast();

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    return (
        <AppWrapper>
            <ToggleButton onClick={toggleSidebar}>
                <i className={`fas fa-${sidebarActive ? 'times' : 'bars'}`}></i>
            </ToggleButton>
            <Sidebar isActive={sidebarActive} />
            <MainContent />
            <Toast toast={toast} onClose={hideToast} />
        </AppWrapper>
    );
};

export default Layout;