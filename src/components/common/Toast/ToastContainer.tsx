// src/components/common/Toast/ToastContainer.tsx
import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Toast } from './Toast';
import { useToast } from '../../../contexts/ToastContext';

const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: ${({ theme }) => theme.zIndices.notification};
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
`;

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (!toasts.length) return null;

    return createPortal(
        <Container>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </Container>,
        document.body
    );
};
