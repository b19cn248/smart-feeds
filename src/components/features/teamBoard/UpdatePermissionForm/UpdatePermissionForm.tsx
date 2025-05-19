// src/components/features/teamBoard/UpdatePermissionForm/UpdatePermissionForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/Button';
import { TeamBoardUser } from '../../../../types';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const PermissionOptions = styled.div`
    display: flex;
    flex-direction: column;
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

const MemberInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
`;

const MemberAvatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.primary.main};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: 14px;
`;

const MemberDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

const MemberName = styled.div`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const MemberEmail = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

interface UpdatePermissionFormProps {
    member: TeamBoardUser;
    onSubmit: (userId: number, email: string, permission: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const UpdatePermissionForm: React.FC<UpdatePermissionFormProps> = ({
                                                                              member,
                                                                              onSubmit,
                                                                              onCancel,
                                                                              isLoading = false
                                                                          }) => {
    const [permission, setPermission] = useState<string>(member.permission);

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(member.user_id, member.email, permission);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <MemberInfo>
                <MemberAvatar>
                    {getInitials(member.name)}
                </MemberAvatar>
                <MemberDetails>
                    <MemberName>{member.name}</MemberName>
                    <MemberEmail>{member.email}</MemberEmail>
                </MemberDetails>
            </MemberInfo>

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

                    <PermissionOption>
                        <input
                            type="radio"
                            name="permission"
                            value="ADMIN"
                            checked={permission === 'ADMIN'}
                            onChange={() => setPermission('ADMIN')}
                        />
                        <div>
                            <div>Admin</div>
                            <PermissionDescription>Full control over the board</PermissionDescription>
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
                    disabled={permission === member.permission}
                >
                    Update Permission
                </Button>
            </Actions>
        </Form>
    );
};