// src/components/features/teamBoard/ShareBoardForm/ShareBoardForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const PermissionOptions = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 4px;
`;

const PermissionOption = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    padding: 8px 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    @media (prefers-color-scheme: dark) {
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

const PermissionLabel = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    margin-bottom: 8px;
`;

const PermissionDescription = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-top: 4px;
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
`;

interface ShareBoardFormProps {
    onSubmit: (email: string, permission: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ShareBoardForm: React.FC<ShareBoardFormProps> = ({
                                                                  onSubmit,
                                                                  onCancel,
                                                                  isLoading = false
                                                              }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('VIEW');
    const [emailError, setEmailError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple email validation
        if (!email.trim() || !email.includes('@')) {
            setEmailError('Please enter a valid email address');
            return;
        }

        onSubmit(email, permission);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label="Email Address"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value.includes('@')) {
                        setEmailError('');
                    }
                }}
                error={emailError}
                leftIcon="envelope"
                required
            />

            <div>
                <PermissionLabel>Permission</PermissionLabel>

                <PermissionOptions>
                    <PermissionOption>
                        <input
                            type="radio"
                            name="permission"
                            value="VIEW"
                            checked={permission === 'VIEW'}
                            onChange={() => setPermission('VIEW')}
                        />
                        <div>
                            <div>View only</div>
                            <PermissionDescription>Can view board content</PermissionDescription>
                        </div>
                    </PermissionOption>

                    <PermissionOption>
                        <input
                            type="radio"
                            name="permission"
                            value="EDIT"
                            checked={permission === 'EDIT'}
                            onChange={() => setPermission('EDIT')}
                        />
                        <div>
                            <div>Edit</div>
                            <PermissionDescription>Can edit board and content</PermissionDescription>
                        </div>
                    </PermissionOption>
                </PermissionOptions>
            </div>

            <Actions>
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
                    Share Board
                </Button>
            </Actions>
        </Form>
    );
};