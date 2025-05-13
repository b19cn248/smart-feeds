// src/components/features/team/TeamForm/TeamForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { TeamCreateRequest } from '../../../../types/team.types';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
`;

interface TeamFormProps {
    onSubmit: (data: TeamCreateRequest) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
                                                      onSubmit,
                                                      onCancel,
                                                      isLoading = false
                                                  }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [enterpriseId] = useState(1); // Assuming a default enterprise ID

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            return; // Validation could be improved
        }

        const teamData: TeamCreateRequest = {
            name: name.trim(),
            description: description.trim() || undefined,
            enterprise_id: enterpriseId
        };

        try {
            await onSubmit(teamData);
            // Reset form after successful submission
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error submitting team form:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Input
                    label="Team Name"
                    placeholder="Enter team name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon="users"
                    required
                />
            </FormGroup>

            <FormGroup>
                <Input
                    label="Description (Optional)"
                    placeholder="Enter team description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    leftIcon="info-circle"
                />
            </FormGroup>

            <ButtonGroup>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                >
                    Create Team
                </Button>
            </ButtonGroup>
        </Form>
    );
};