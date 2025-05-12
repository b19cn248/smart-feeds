// src/services/teamBoardService.ts
import {
    TeamBoardsResponse,
    TeamBoardDetailResponse,
    TeamBoardResponse,
    TeamBoardCreateRequest,
    TeamBoardUpdateRequest,
    TeamBoardShareRequest,
    TeamBoardNotesResponse,
    TeamBoardHighlightsResponse
} from '../types';
import { apiClient } from './apiClient';

export const teamBoardService = {
    /**
     * Lấy danh sách Team Board
     */
    getTeamBoards: async (page = 0, size = 10, sort = 'created_at,desc'): Promise<TeamBoardsResponse> => {
        return apiClient.get<TeamBoardsResponse>(`/api/v1/team-boards?page=${page}&size=${size}&sort=${sort}`);
    },

    /**
     * Lấy danh sách Team Board theo team
     */
    getTeamBoardsByTeam: async (teamId: number, page = 0, size = 10, sort = 'name,asc'): Promise<TeamBoardsResponse> => {
        return apiClient.get<TeamBoardsResponse>(`/api/v1/team-boards/by-team/${teamId}?page=${page}&size=${size}&sort=${sort}`);
    },

    /**
     * Lấy chi tiết Team Board
     */
    getTeamBoardById: async (id: number, page = 0, size = 10, sort = 'created_at,desc'): Promise<TeamBoardDetailResponse> => {
        return apiClient.get<TeamBoardDetailResponse>(`/api/v1/team-boards/${id}?page=${page}&size=${size}&sort=${sort}`);
    },

    /**
     * Tạo Team Board mới
     */
    createTeamBoard: async (data: TeamBoardCreateRequest): Promise<TeamBoardResponse> => {
        return apiClient.post<TeamBoardResponse>('/api/v1/team-boards', data);
    },

    /**
     * Cập nhật Team Board
     */
    updateTeamBoard: async (id: number, data: TeamBoardUpdateRequest): Promise<TeamBoardResponse> => {
        return apiClient.put<TeamBoardResponse>(`/api/v1/team-boards/${id}`, data);
    },

    /**
     * Xóa Team Board
     */
    deleteTeamBoard: async (id: number): Promise<any> => {
        return apiClient.delete(`/api/v1/team-boards/${id}`);
    },

    /**
     * Chia sẻ Team Board với người dùng khác
     */
    shareTeamBoard: async (id: number, data: TeamBoardShareRequest): Promise<any> => {
        return apiClient.post(`/api/v1/team-boards/${id}/share`, data);
    },

    /**
     * Cập nhật quyền của thành viên
     */
    updateMemberPermission: async (boardId: number, userId: number, data: TeamBoardShareRequest): Promise<any> => {
        return apiClient.put(`/api/v1/team-boards/${boardId}/members/${userId}`, data);
    },

    /**
     * Xóa thành viên khỏi Team Board
     */
    removeMember: async (boardId: number, userId: number): Promise<any> => {
        return apiClient.delete(`/api/v1/team-boards/${boardId}/members/${userId}`);
    },

    /**
     * Thêm bài viết vào Team Board
     */
    addArticleToTeamBoard: async (boardId: number, articleId: number): Promise<any> => {
        return apiClient.post(`/api/v1/team-boards/${boardId}/articles`, { article_id: articleId });
    },

    /**
     * Xóa bài viết khỏi Team Board
     */
    removeArticleFromTeamBoard: async (boardId: number, articleId: number): Promise<any> => {
        return apiClient.delete(`/api/v1/team-boards/${boardId}/articles/${articleId}`);
    },

    /**
     * Lấy danh sách ghi chú cho bài viết
     */
    getArticleNotes: async (boardId: number, articleId: number): Promise<TeamBoardNotesResponse> => {
        return apiClient.get<TeamBoardNotesResponse>(`/api/v1/team-boards/${boardId}/articles/${articleId}/notes`);
    },

    /**
     * Thêm ghi chú cho bài viết
     */
    addArticleNote: async (boardId: number, articleId: number, content: string): Promise<any> => {
        return apiClient.post(`/api/v1/team-boards/${boardId}/notes`, {
            article_id: articleId,
            content
        });
    },

    /**
     * Lấy danh sách highlights cho bài viết
     */
    getArticleHighlights: async (boardId: number, articleId: number): Promise<TeamBoardHighlightsResponse> => {
        return apiClient.get<TeamBoardHighlightsResponse>(`/api/v1/team-boards/${boardId}/articles/${articleId}/highlights`);
    },

    /**
     * Thêm highlight cho bài viết
     */
    addArticleHighlight: async (boardId: number, articleId: number, highlightText: string, positionInfo: string): Promise<any> => {
        return apiClient.post(`/api/v1/team-boards/${boardId}/highlights`, {
            article_id: articleId,
            highlight_text: highlightText,
            position_info: positionInfo
        });
    }
};