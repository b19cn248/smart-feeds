// src/components/features/teamBoard/TeamBoardForm/TeamBoardForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { TeamBoard } from '../../../../types';
import { useTeam } from '../../../../contexts/TeamContext'; // Import useTeam hook
import { useToast } from '../../../../contexts/ToastContext';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
`;

const TeamSelect = styled.select`
    padding: 10px 14px;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    width: 100%;
    transition: ${({ theme }) => theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary.main};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}40;
    }

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[600]};
        background-color: ${({ theme }) => theme.colors.gray[800]};

        &:focus {
            border-color: ${({ theme }) => theme.colors.primary.main};
        }
    }
`;

const TeamLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
`;

// Thêm styled component cho textarea
const StyledTextarea = styled.textarea`
    padding: 10px 14px;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    width: 100%;
    min-height: 100px;
    resize: vertical;
    transition: ${({ theme }) => theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary.main};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}40;
    }

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme }) => theme.colors.gray[600]};
        background-color: ${({ theme }) => theme.colors.gray[800]};

        &:focus {
            border-color: ${({ theme }) => theme.colors.primary.main};
        }
    }
`;

const TextareaLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
`;

interface TeamBoardFormProps {
    board?: TeamBoard;
    onSubmit: (name: string, description: string, teamId: number) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const TeamBoardForm: React.FC<TeamBoardFormProps> = ({
                                                                board,
                                                                onSubmit,
                                                                onCancel,
                                                                isLoading = false
                                                            }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [teamId, setTeamId] = useState<number | string>('');
    const [nameError, setNameError] = useState('');

    // Sử dụng TeamContext
    const { teams, isLoading: isLoadingTeams, fetchTeams } = useTeam();
    const { showToast } = useToast();

    // Fetch teams khi component mount nếu cần
    useEffect(() => {
        if (teams.length === 0) {
            fetchTeams();
        }
    }, [teams.length, fetchTeams]);

    // Pre-fill form if editing an existing board
    useEffect(() => {
        if (board) {
            setName(board.name);
            setDescription(board.description || '');
            setTeamId(board.team_id);
        } else if (teams.length > 0) {
            // Default to first team if creating new board
            setTeamId(teams[0].id);
        }
    }, [board, teams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!name.trim()) {
            setNameError('Board name is required');
            return;
        }

        if (!teamId) {
            showToast('error', 'Error', 'Please select a team');
            return;
        }

        onSubmit(name, description, Number(teamId));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div>
                <Input
                    label="Name"
                    placeholder="Enter team board name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value.trim()) {
                            setNameError('');
                        }
                    }}
                    error={nameError}
                    required
                />
            </div>

            <div>
                <TextareaLabel htmlFor="description">Description</TextareaLabel>
                <StyledTextarea
                    id="description"
                    placeholder="Enter description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>

            <div>
                <TeamLabel>Team</TeamLabel>
                <TeamSelect
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    required
                    disabled={isLoadingTeams}
                >
                    <option value="" disabled>Select a team</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </TeamSelect>
            </div>

            <Actions>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading || isLoadingTeams}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading || isLoadingTeams}
                    disabled={isLoadingTeams}
                >
                    {board ? 'Update' : 'Create'} Board
                </Button>
            </Actions>
        </Form>
    );
};