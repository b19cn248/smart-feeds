// src/components/features/team/AddMemberForm/AddMemberForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { AddTeamMemberRequest } from '../../../../types/team.types';

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

const RadioGroup = styled.div`
    display: flex;
    gap: 16px;
`;

const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
`;

interface AddMemberFormProps {
    teamId: number;
    onSubmit: (teamId: number, data: AddTeamMemberRequest) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({
                                                                teamId,
                                                                onSubmit,
                                                                onCancel,
                                                                isLoading = false
                                                            }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('MEMBER');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            return; // Validation could be improved
        }

        const memberData: AddTeamMemberRequest = {
            email: email.trim(),
            role
        };

        try {
            await onSubmit(teamId, memberData);
            // Reset form after successful submission
            setEmail('');
            setRole('MEMBER');
        } catch (error) {
            console.error('Error submitting add member form:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Input
                    label="Email Address"
                    placeholder="Enter member email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon="envelope"
                    type="email"
                    required
                />
            </FormGroup>

            <FormGroup>
                <label>Role</label>
                <RadioGroup>
                    <RadioLabel>
                        <input
                            type="radio"
                            name="role"
                            value="MEMBER"
                            checked={role === 'MEMBER'}
                            onChange={() => setRole('MEMBER')}
                        />
                        Member
                    </RadioLabel>
                    <RadioLabel>
                        <input
                            type="radio"
                            name="role"
                            value="ADMIN"
                            checked={role === 'ADMIN'}
                            onChange={() => setRole('ADMIN')}
                        />
                        Admin
                    </RadioLabel>
                </RadioGroup>
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
                    Add Member
                </Button>
            </ButtonGroup>
        </Form>
    );
};