// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FolderProvider } from './contexts/FolderContext';
import { ToastProvider } from './contexts/ToastContext';
import { SourceProvider } from './contexts/SourceContext';
import { BoardProvider } from './contexts/BoardContext';
import { TeamProvider } from './contexts/TeamContext';
import { TeamBoardProvider } from './contexts/TeamBoardContext';
import { MainLayout } from './components/features/layout/MainLayout';
import { FoldersPage } from './pages/FoldersPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { SourcesPage } from './pages/SourcesPage';
import { BoardsPage } from './pages/BoardsPage';
import { BoardDetailPage } from './pages/BoardDetailPage';
import { TeamsPage } from './pages/TeamsPage';
import { FolderDetailPage } from './pages/FolderDetailPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ToastContainer } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';
import { ThemeProvider } from "./contexts/ThemeContext";
import {TeamBoardsPage} from "./pages/TeamBoardsPage";
import {TeamBoardDetailPage} from "./pages/TeamBoardDetailPage";

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <GlobalStyles />
            <BrowserRouter>
                <AuthProvider>
                    <ToastProvider>
                        <FolderProvider>
                            <SourceProvider>
                                <BoardProvider>
                                    <TeamProvider>
                                        <TeamBoardProvider>
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

                                                {/* Teams Route */}
                                                <Route
                                                    path="/teams"
                                                    element={
                                                        <ProtectedRoute>
                                                            <MainLayout headerTitle="Teams">
                                                                <TeamsPage />
                                                            </MainLayout>
                                                        </ProtectedRoute>
                                                    }
                                                />

                                                {/* Team Boards Routes */}
                                                <Route
                                                    path="/team-boards"
                                                    element={
                                                        <ProtectedRoute>
                                                            <MainLayout headerTitle="Team Boards">
                                                                <TeamBoardsPage />
                                                            </MainLayout>
                                                        </ProtectedRoute>
                                                    }
                                                />
                                                <Route
                                                    path="/team-boards/:boardId"
                                                    element={
                                                        <ProtectedRoute>
                                                            <MainLayout headerTitle="Team Board Detail">
                                                                <TeamBoardDetailPage />
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
                                        </TeamBoardProvider>
                                    </TeamProvider>
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