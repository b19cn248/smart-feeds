export interface TeamMember {
    id: number;
    name: string;
    email: string;
}

export interface TeamMembersResponse {
    status: number;
    message: string;
    data: TeamMember[];
    timestamp: string;
}

// ... rest of existing types ... 