// src/components/features/board/BoardModal/BoardModal.tsx
import React from 'react';
import { Modal } from '../../../common/Modal';
import { BoardForm } from '../BoardForm';
import { BoardCreateRequest, BoardUpdateRequest } from '../../../../types';

interface BoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BoardCreateRequest | BoardUpdateRequest) => void;
    initialData?: Partial<BoardCreateRequest>;
    mode?: 'create' | 'edit';
    isLoading?: boolean;
}

export const BoardModal: React.FC<BoardModalProps> = ({
                                                          isOpen,
                                                          onClose,
                                                          onSubmit,
                                                          initialData,
                                                          mode = 'create',
                                                          isLoading = false
                                                      }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Create new board' : 'Edit board'}
            size="md"
        >
            <BoardForm
                initialData={initialData}
                onSubmit={onSubmit}
                onCancel={onClose}
                submitLabel={mode === 'create' ? 'Create board' : 'Save changes'}
                isLoading={isLoading}
                isEditing={mode === 'edit'}
            />
        </Modal>
    );
};