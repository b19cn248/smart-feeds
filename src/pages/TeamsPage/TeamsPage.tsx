// src/pages/TeamsPage/TeamsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TeamList } from '../../components/features/team/TeamList';
import { TeamForm } from '../../components/features/team/TeamForm';
import { AddMemberForm } from '../../components/features/team/AddMemberForm';
import { TeamMemberList } from '../../components/features/team/TeamMemberList';
import { RemoveMemberConfirmationModal } from '../../components/features/team/RemoveMemberConfirmationModal';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useTeam } from '../../contexts/TeamContext';
import { useToast } from '../../contexts/ToastContext';
import { Team, TeamCreateRequest, AddTeamMemberRequest, TeamMember } from '../../types/team.types';
import { useDebounce } from '../../hooks';
import { LoadingScreen } from '../../components/common/LoadingScreen';

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;

    i {
        color: ${({ theme }) => theme.colors.primary.main};
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        justify-content: space-between;
    }
`;

const SearchWrapper = styled.div`
    position: relative;
    max-width: 240px;
    width: 100%;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        max-width: 100%;
    }
`;

export const TeamsPage: React.FC = () => {
    // Team context and state
    const {
        teams,
        isLoading,
        error,
        fetchTeams,
        createTeam,
        addTeamMember,
        removeTeamMember,
        teamMembers,
        fetchTeamMembers
    } = useTeam();
    const { showToast } = useToast();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    // Debounced search
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Handle team click
    const handleTeamClick = (teamId: number) => {
        const team = teams.find(t => t.id === teamId);
        if (team) {
            setSelectedTeam(team);
            // You can implement navigation to team details page here
            console.log('Team clicked:', teamId);
        }
    };

    // Open members modal
    const handleViewMembers = (teamId: number) => {
        const team = teams.find(t => t.id === teamId);
        if (team) {
            setSelectedTeam(team);
            // Fetch team members when opening the modal
            fetchTeamMembers(teamId);
            setShowMembersModal(true);
        }
    };

    // Open add member modal
    const handleAddMember = (teamId: number) => {
        const team = teams.find(t => t.id === teamId);
        if (team) {
            setSelectedTeam(team);
            setShowAddMemberModal(true);
        }
    };

    // Handle create team
    const handleCreateTeam = async (data: TeamCreateRequest) => {
        try {
            await createTeam(data);
            showToast('success', 'Success', 'Team created successfully');
            setShowCreateModal(false);
        } catch (error) {
            showToast('error', 'Error', 'Failed to create team');
        }
    };

    // Handle add team member
    const handleAddTeamMember = async (teamId: number, data: AddTeamMemberRequest) => {
        try {
            await addTeamMember(teamId, data);
            showToast('success', 'Success', 'Team member added successfully');
            setShowAddMemberModal(false);

            // Refresh team members list if the modal is still open
            if (showMembersModal && selectedTeam && selectedTeam.id === teamId) {
                fetchTeamMembers(teamId);
            }
        } catch (error) {
            showToast('error', 'Error', 'Failed to add team member');
        }
    };

    // Handle remove team member
    const handleRemoveMember = (member: TeamMember) => {
        setSelectedMember(member);
        setShowRemoveMemberModal(true);
    };

    // Confirm remove team member
    const confirmRemoveMember = async () => {
        if (!selectedTeam || !selectedMember) return;

        try {
            await removeTeamMember(selectedTeam.id, selectedMember.user_id);
            showToast('success', 'Success', 'Team member removed successfully');
            setShowRemoveMemberModal(false);

            // Refresh team members list
            if (selectedTeam) {
                fetchTeamMembers(selectedTeam.id);
            }
        } catch (error) {
            showToast('error', 'Error', 'Failed to remove team member');
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchTeams()
            .then(() => {
                showToast('success', 'Success', 'Teams refreshed');
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to refresh teams');
            });
    };

    if (isLoading && teams.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <>
            <PageHeader>
                <PageTitle>
                    <i className="fas fa-users" />
                    Teams
                </PageTitle>

                <Actions>
                    <SearchWrapper>
                        <Input
                            type="text"
                            placeholder="Search teams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon="search"
                        />
                    </SearchWrapper>

                    <Button onClick={() => setShowCreateModal(true)} leftIcon="plus">
                        Create Team
                    </Button>

                    <Button variant="ghost" onClick={handleRefresh} leftIcon="sync">
                        Refresh
                    </Button>
                </Actions>
            </PageHeader>

            {error && (
                <div style={{ marginBottom: '20px', color: 'red' }}>
                    Error: {error}
                </div>
            )}

            <TeamList
                teams={teams}
                onTeamClick={handleTeamClick}
                onViewMembers={handleViewMembers}
                onAddMember={handleAddMember}
                searchQuery={debouncedSearch}
            />

            {/* Create Team Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Team"
                size="sm"
            >
                <TeamForm
                    onSubmit={handleCreateTeam}
                    onCancel={() => setShowCreateModal(false)}
                    isLoading={isLoading}
                />
            </Modal>

            {/* View Members Modal */}
            <Modal
                isOpen={showMembersModal}
                onClose={() => setShowMembersModal(false)}
                title={selectedTeam ? `${selectedTeam.name} Members` : 'Team Members'}
                size="sm"
            >
                <TeamMemberList
                    members={teamMembers}
                    onRemoveMember={handleRemoveMember}
                    teamId={selectedTeam?.id}
                />
            </Modal>

            {/* Add Member Modal */}
            <Modal
                isOpen={showAddMemberModal}
                onClose={() => setShowAddMemberModal(false)}
                title={selectedTeam ? `Add Member to ${selectedTeam.name}` : 'Add Team Member'}
                size="sm"
            >
                {selectedTeam && (
                    <AddMemberForm
                        teamId={selectedTeam.id}
                        onSubmit={handleAddTeamMember}
                        onCancel={() => setShowAddMemberModal(false)}
                        isLoading={isLoading}
                    />
                )}
            </Modal>

            {/* Remove Member Confirmation Modal */}
            <RemoveMemberConfirmationModal
                isOpen={showRemoveMemberModal}
                onClose={() => setShowRemoveMemberModal(false)}
                onConfirm={confirmRemoveMember}
                member={selectedMember}
                isLoading={isLoading}
            />
        </>
    );
};