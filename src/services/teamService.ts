// src/services/teamService.ts
import {
    Team,
    TeamResponse,
    TeamsResponse,
    TeamCreateRequest,
    AddTeamMemberRequest,
    TeamMemberResponse,
    TeamMembersResponse
} from '../types/team.types';
import { apiClient } from './apiClient';

export const teamService = {
    /**
     * Lấy danh sách teams
     * @param page Số trang, bắt đầu từ 0
     * @param size Số lượng item trên một trang
     * @param sort Sắp xếp, mặc định là name,asc
     */
    getTeams: async (page = 0, size = 20, sort = 'name,asc'): Promise<TeamsResponse> => {
        return apiClient.get<TeamsResponse>(`/teams?page=${page}&size=${size}&sort=${sort}`);
    },

    /**
     * Tạo team mới
     * @param data Dữ liệu team cần tạo
     */
    createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
        return apiClient.post<TeamResponse>('/teams', data);
    },

    /**
     * Thêm thành viên vào team
     * @param teamId ID của team
     * @param data Dữ liệu thành viên cần thêm
     */
    addTeamMember: async (teamId: number, data: AddTeamMemberRequest): Promise<TeamMemberResponse> => {
        return apiClient.post<TeamMemberResponse>(`/teams/${teamId}/members`, data);
    },

    /**
     * Lấy danh sách thành viên của team
     * @param teamId ID của team
     */
    getTeamMembers: async (teamId: number): Promise<TeamMembersResponse> => {
        return apiClient.get<TeamMembersResponse>(`/teams/${teamId}/members`);
    },

    /**
     * Xóa thành viên khỏi team
     * @param teamId ID của team
     * @param memberId ID của user cần xóa (user_id)
     */
    removeTeamMember: async (teamId: number, memberId: number): Promise<any> => {
        return apiClient.delete<any>(`/teams/${teamId}/members/${memberId}`);
    },
};