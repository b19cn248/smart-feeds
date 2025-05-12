// src/types/team.types.ts
export interface Team {
    id: number;
    name: string;
    description: string | null;
    enterprise_id: number;
    created_at: string;
    created_by: string;
}

export interface TeamMember {
    id: number;
    team_id: number;
    user_id: number;
    email: string;
    name: string;
    role: string;
    created_at: string;
}

export interface TeamCreateRequest {
    name: string;
    description?: string;
    enterprise_id: number;
}

export interface AddTeamMemberRequest {
    email: string;
    role: string;
}

export interface TeamResponse {
    status: number;
    message: string;
    data: Team;
    timestamp: string;
}

export interface TeamsResponse {
    status: number;
    message: string;
    data: {
        content: Team[];
        total_elements: number;
        total_pages: number;
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        number_of_elements: number;
        empty: boolean;
    };
    timestamp: string;
}

export interface TeamMemberResponse {
    status: number;
    message: string;
    data: TeamMember;
    timestamp: string;
}

export interface TeamMembersResponse {
    status: number;
    message: string;
    data: TeamMember[]; // API trả về mảng thành viên thay vì pagination
    timestamp: string;
}