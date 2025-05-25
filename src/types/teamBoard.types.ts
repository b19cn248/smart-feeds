// src/types/teamBoard.types.ts
import { Article } from './article.types';

export interface TeamBoardUser {
    id: number;
    team_board_id: number;
    user_id: number;
    email: string;
    name: string;
    permission: 'ADMIN' | 'EDIT' | 'VIEW';
    created_at: string;
}

export interface TeamBoard {
    id: number;
    name: string;
    description: string;
    team_id: number;
    team_name: string;
    created_at: string;
    created_by: string;
    user_permission?: string;
}

export interface TeamBoardDetail extends TeamBoard {
    members: TeamBoardUser[];
    articles: {
        content: Article[];
        total_elements: number;
        total_pages: number;
        last: boolean;
        first: boolean;
        size: number;
        number: number;
        number_of_elements: number;
        empty: boolean;
    };
}

export interface TeamBoardNote {
    id: number;
    team_board_id: number;
    article_id: number;
    content: string;
    mentioned_users: string | null;
    created_by_email: string;
    created_by_name: string;
    created_at: string;
}

export interface TeamBoardHighlight {
    id: number;
    team_board_id: number;
    article_id: number;
    highlight_text: string;
    position_info: string;
    created_by_email: string;
    created_by_name: string;
    created_at: string;
}

export interface TeamBoardNewsletter {
    id: number;
    team_board_id: number;
    title: string;
    recipients: string[];
    article_ids: number[];
    schedule_type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'IMMEDIATE';
    next_run_time: string;
    last_run_time: string | null;
    is_active: boolean;
    created_at: string;
}

// Thêm interface mới cho request tạo newsletter
export interface TeamBoardNewsletterCreateRequest {
    title: string;
    recipients: string[];
    article_ids: number[];
    schedule_type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'IMMEDIATE';
}

export interface TeamBoardCreateRequest {
    name: string;
    description: string;
    team_id: number;
}

export interface TeamBoardUpdateRequest {
    name: string;
    description: string;
    team_id: number;
}

export interface TeamBoardShareRequest {
    email: string;
    permission: 'ADMIN' | 'EDIT' | 'VIEW';
}

export interface TeamBoardResponse {
    status: number;
    message: string;
    data: TeamBoard;
    timestamp: string;
}

export interface TeamBoardDetailResponse {
    status: number;
    message: string;
    data: TeamBoardDetail;
    timestamp: string;
}

export interface TeamBoardsResponse {
    status: number;
    message: string;
    data: {
        content: TeamBoard[];
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

export interface TeamBoardNotesResponse {
    status: number;
    message: string;
    data: TeamBoardNote[];
    timestamp: string;
}

export interface TeamBoardHighlightsResponse {
    status: number;
    message: string;
    data: TeamBoardHighlight[];
    timestamp: string;
}