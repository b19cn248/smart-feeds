// src/App.tsx
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { FolderProvider } from './contexts/FolderContext';
import { ToastProvider } from './contexts/ToastContext';
import { MainLayout } from './components/features/layout/MainLayout';
import { FoldersPage } from './pages/FoldersPage';
import { ToastContainer } from './components/common/Toast';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <ToastProvider>
                <FolderProvider>
                    <MainLayout headerTitle="My Feeds">
                        <FoldersPage />
                    </MainLayout>
                    <ToastContainer />
                </FolderProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;