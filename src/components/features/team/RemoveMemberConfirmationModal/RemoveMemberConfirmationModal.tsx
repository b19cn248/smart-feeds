// src/components/features/team/RemoveMemberConfirmationModal/RemoveMemberConfirmationModal.tsx
import React from 'react';
import styled from 'styled-components';
import { Modal } from '../../../common/Modal';
import { Button } from '../../../common/Button';
import { TeamMember } from '../../../../types/team.types';

const ModalContent = styled.div`
    padding: 20px 0;
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

const HighlightText = styled.span`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
`;

interface RemoveMemberConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    member: TeamMember | null;
    isLoading?: boolean;
}

export const RemoveMemberConfirmationModal: React.FC<RemoveMemberConfirmationModalProps> = ({
                                                                                                isOpen,
                                                                                                onClose,
                                                                                                onConfirm,
                                                                                                member,
                                                                                                isLoading = false
                                                                                            }) => {
    if (!member) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Remove Team Member"
            size="sm"
        >
            <ModalContent>
                <p>
                    Are you sure you want to remove <HighlightText>{member.name}</HighlightText> ({member.email}) from this team?
                </p>
                <p>
                    This action cannot be undone. The member will lose access to all team resources.
                </p>
            </ModalContent>
            <ModalActions>
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="secondary"
                    onClick={onConfirm}
                    isLoading={isLoading}
                    leftIcon="user-minus"
                >
                    Remove Member
                </Button>
            </ModalActions>
        </Modal>
    );
};