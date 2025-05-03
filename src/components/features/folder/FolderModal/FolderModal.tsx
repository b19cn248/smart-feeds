// src/components/features/folder/FolderModal/FolderModal.tsx
import React from 'react';
import {Modal} from '../../../common/Modal';
import {FolderForm} from '../FolderForm';
import {FolderFormData} from '../../../../types';

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FolderFormData) => void;
    initialData?: Partial<FolderFormData>;
    mode?: 'create' | 'edit';
}

export const FolderModal: React.FC<FolderModalProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            onSubmit,
                                                            initialData,
                                                            mode = 'create'
                                                        }) => {
    const handleSubmit = (data: FolderFormData) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Create new folder' : 'Edit folder'}
            size="sm"
        >
            <FolderForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={onClose}
                submitLabel={mode === 'create' ? 'Create folder' : 'Save changes'}
            />
        </Modal>
    );
};
