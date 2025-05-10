// src/services/boardService.ts
import {
    BoardsResponse,
    BoardResponse,
    BoardCreateRequest,
    BoardUpdateRequest,
    AddArticleRequest,
    AddArticleFromUrlRequest
} from '../types';
import { apiClient } from './apiClient';

export const boardService = {
    /**
     * Lấy danh sách boards
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     * @param sort Sắp xếp, mặc định là createdAt,desc
     */
    getBoards: async (page = 0, size = 20, sort = 'createdAt,desc'): Promise<BoardsResponse> => {
        return apiClient.get<BoardsResponse>(`/boards?page=${page}&size=${size}&sort=${sort}`);
    },

    /**
     * Lấy chi tiết board theo ID
     * @param id ID của board
     */
    getBoardById: async (id: number): Promise<BoardResponse> => {
        return apiClient.get<BoardResponse>(`/boards/${id}`);
    },

    /**
     * Tạo board mới
     * @param data Dữ liệu board cần tạo
     */
    createBoard: async (data: BoardCreateRequest): Promise<BoardResponse> => {
        return apiClient.post<BoardResponse>('/boards', data);
    },

    /**
     * Cập nhật board
     * @param id ID của board
     * @param data Dữ liệu cập nhật
     */
    updateBoard: async (id: number, data: BoardUpdateRequest): Promise<BoardResponse> => {
        return apiClient.put<BoardResponse>(`/boards/${id}`, data);
    },

    /**
     * Xóa board
     * @param id ID của board
     */
    deleteBoard: async (id: number): Promise<BoardResponse> => {
        return apiClient.delete<BoardResponse>(`/boards/${id}`);
    },

    /**
     * Thêm article vào board
     * @param boardId ID của board
     * @param data Dữ liệu article cần thêm
     */
    addArticleToBoard: async (boardId: number, data: AddArticleRequest): Promise<BoardResponse> => {
        return apiClient.post<BoardResponse>(`/boards/${boardId}/articles`, data);
    },

    /**
     * Thêm article từ URL vào board
     * @param boardId ID của board
     * @param data Dữ liệu article từ URL
     */
    addArticleFromUrlToBoard: async (boardId: number, data: AddArticleFromUrlRequest): Promise<BoardResponse> => {
        return apiClient.post<BoardResponse>(`/boards/${boardId}/articles/url`, data);
    },

    /**
     * Xóa article khỏi board
     * @param boardId ID của board
     * @param articleId ID của article
     */
    removeArticleFromBoard: async (boardId: number, articleId: number): Promise<BoardResponse> => {
        return apiClient.delete<BoardResponse>(`/boards/${boardId}/articles/${articleId}`);
    }
};