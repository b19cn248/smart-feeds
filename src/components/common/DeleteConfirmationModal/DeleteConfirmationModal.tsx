// src/components/common/DeleteConfirmationModal/DeleteConfirmationModal.tsx
import React from 'react';
import styled from 'styled-components';
import {Modal} from "../Modal";
import {Button} from "../Button";

const ModalContent = styled.div`
    padding: 20px 0;
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
                                                                                    isOpen,
                                                                                    onClose,
                                                                                    onConfirm,
                                                                                    title = 'Confirm Delete',
                                                                                    message,
                                                                                    confirmButtonText = 'Delete',
                                                                                    cancelButtonText = 'Cancel',
                                                                                    isLoading = false
                                                                                }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <ModalContent>
                <p>{message}</p>
            </ModalContent>
            <ModalActions>
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {cancelButtonText}
                </Button>
                <Button
                    variant="secondary"
                    onClick={onConfirm}
                    isLoading={isLoading}
                >
                    {confirmButtonText}
                </Button>
            </ModalActions>
        </Modal>
    );
};