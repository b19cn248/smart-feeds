// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FolderProvider } from './contexts/FolderContext';
import { ToastProvider } from './contexts/ToastContext';
import { SourceProvider } from './contexts/SourceContext';
import { BoardProvider } from './contexts/BoardContext'; // Thêm dòng này
import { MainLayout } from './components/features/layout/MainLayout';
import { FoldersPage } from './pages/FoldersPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { SourcesPage } from './pages/SourcesPage';
import { BoardsPage } from './pages/BoardsPage'; // Thêm dòng này
import { BoardDetailPage } from './pages/BoardDetailPage'; // Thêm dòng này
import { FolderDetailPage } from './pages/FolderDetailPage'; // Import FolderDetailPage
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ToastContainer } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';
import {ThemeProvider} from "./contexts/ ThemeContext";

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <GlobalStyles />
            <BrowserRouter>
                <AuthProvider>
                    <ToastProvider>
                        <FolderProvider>
                            <SourceProvider>
                                <BoardProvider> {/* Thêm BoardProvider */}
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

                                        {/* Folder Detail Route */}
                                        <Route
                                            path="/folder/:folderId"
                                            element={
                                                <ProtectedRoute>
                                                    <MainLayout headerTitle="Folder Articles">
                                                        <FolderDetailPage />
                                                    </MainLayout>
                                                </ProtectedRoute>
                                            }
                                        />

                                        {/* Boards Routes */}
                                        <Route
                                            path="/boards"
                                            element={
                                                <ProtectedRoute>
                                                    <MainLayout headerTitle="Boards">
                                                        <BoardsPage />
                                                    </MainLayout>
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/boards/:boardId"
                                            element={
                                                <ProtectedRoute>
                                                    <MainLayout headerTitle="Board Detail">
                                                        <BoardDetailPage />
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
                                </BoardProvider>
                            </SourceProvider>
                        </FolderProvider>
                    </ToastProvider>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;