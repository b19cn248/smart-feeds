// src/components/common/Modal/Modal.tsx
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';
import { ModalProps } from '../../../types';
import { overlay, fadeIn, iconButton } from '../../../styles/mixins';

const Overlay = styled.div<{ isOpen: boolean }>`
    ${overlay}
    ${fadeIn}
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transition: opacity ${({ theme }) => theme.transitions.default},
    visibility ${({ theme }) => theme.transitions.default};
`;

const ModalContainer = styled.div<{ isOpen: boolean; size?: ModalProps['size'] }>`
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(20px)'};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    transition: transform ${({ theme }) => theme.transitions.default},
    opacity ${({ theme }) => theme.transitions.default};
    overflow: hidden;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;

    ${({ size }) => {
        switch (size) {
            case 'sm':
                return css`width: 360px;`;
            case 'lg':
                return css`width: 600px;`;
            default:
                return css`width: 480px;`;
        }
    }}
`;

const ModalHeader = styled.div`
    padding: 20px 24px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalTitle = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
`;

const CloseButton = styled.button`
    ${iconButton}
`;

const ModalBody = styled.div`
    padding: 24px;
    overflow-y: auto;
    flex: 1;
`;

const ModalFooter = styled.div`
    padding: 16px 24px;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
    background-color: ${({ theme }) => theme.colors.gray[50]};
`;

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                children,
                                                footer,
                                                size = 'md',
                                            }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previouslyFocusedElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            previouslyFocusedElement.current?.focus();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <Overlay
            isOpen={isOpen}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <ModalContainer
                isOpen={isOpen}
                size={size}
                ref={modalRef}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
            >
                {(title || onClose) && (
                    <ModalHeader>
                        {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
                        <CloseButton
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <i className="fas fa-times" />
                        </CloseButton>
                    </ModalHeader>
                )}
                <ModalBody>{children}</ModalBody>
                {footer && <ModalFooter>{footer}</ModalFooter>}
            </ModalContainer>
        </Overlay>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};