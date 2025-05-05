// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { FolderProvider } from './contexts/FolderContext';
import { ToastProvider } from './contexts/ToastContext';
import { SourceProvider } from './contexts/SourceContext'; // Add SourceProvider
import { MainLayout } from './components/features/layout/MainLayout';
import { FoldersPage } from './pages/FoldersPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { SourcesPage } from './pages/SourcesPage'; // Import SourcesPage
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ToastContainer } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <BrowserRouter>
                <AuthProvider>
                    <ToastProvider>
                        <FolderProvider>
                            <SourceProvider> {/* Add SourceProvider */}
                                <Routes>
                                    {/* Protected Routes */}
                                    <Route
                                        path="/"
                                        element={
                                            <ProtectedRoute>
                                                <MainLayout headerTitle="Home">
                                                    <ArticlesPage />
                                                </MainLayout>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* My Feeds Route */}
                                    <Route
                                        path="/feeds"
                                        element={
                                            <ProtectedRoute>
                                                <MainLayout headerTitle="My Feeds">
                                                    <FoldersPage />
                                                </MainLayout>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Sources Route */}
                                    <Route
                                        path="/sources"
                                        element={
                                            <ProtectedRoute>
                                                <MainLayout headerTitle="Sources">
                                                    <SourcesPage />
                                                </MainLayout>
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Unauthorized page */}
                                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                                    {/* Catch all route */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>

                                <ToastContainer />
                            </SourceProvider>
                        </FolderProvider>
                    </ToastProvider>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;