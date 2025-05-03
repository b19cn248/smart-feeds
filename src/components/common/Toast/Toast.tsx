// src/components/common/Toast/Toast.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { Toast as ToastType, ToastType as ToastVariant } from '../../../types';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: ${({ theme }) => theme.zIndices.notification};
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
`;

const getToastColors = (type: ToastVariant, theme: any) => {
    switch (type) {
        case 'success':
            return {
                color: theme.colors.success,
                background: `${theme.colors.success}10`,
            };
        case 'error':
            return {
                color: theme.colors.error,
                background: `${theme.colors.error}10`,
            };
        case 'warning':
            return {
                color: theme.colors.warning,
                background: `${theme.colors.warning}10`,
            };
        case 'info':
            return {
                color: theme.colors.info,
                background: `${theme.colors.info}10`,
            };
        default:
            return {
                color: theme.colors.gray[700],
                background: theme.colors.gray[100],
            };
    }
};

const ToastWrapper = styled.div<{ isVisible: boolean; type: ToastVariant }>`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: stretch;
  min-width: 300px;
  max-width: 480px;
  overflow: hidden;
  pointer-events: auto;
  
  animation: ${({ isVisible }) => isVisible ? slideIn : slideOut} 0.3s ease-out forwards;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-width: 100%;
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ToastIcon = styled.div<{ type: ToastVariant }>`
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ type, theme }) => getToastColors(type, theme).background};
  color: ${({ type, theme }) => getToastColors(type, theme).color};
  
  i {
    font-size: 18px;
  }
`;

const ToastContent = styled.div`
  flex: 1;
  padding: 12px 16px;
`;

const ToastTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
`;

const ToastMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const ToastClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
  
  &:focus {
    outline: none;
  }
  
  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[700]};
    }
  }
`;

const ToastProgress = styled.div<{ duration: number; type: ToastVariant }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${({ type, theme }) => getToastColors(type, theme).color};
  animation: progress ${({ duration }) => duration}ms linear forwards;
  
  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

const getToastIcon = (type: ToastVariant): string => {
    switch (type) {
        case 'success':
            return 'check-circle';
        case 'error':
            return 'exclamation-circle';
        case 'warning':
            return 'exclamation-triangle';
        case 'info':
            return 'info-circle';
        default:
            return 'info-circle';
    }
};

interface ToastComponentProps {
    toast: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastComponentProps> = ({
                                                         toast,
                                                         onClose,
                                                         duration = 3000
                                                     }) => {
    const [isVisible, setIsVisible] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const toastElement = (
        <ToastWrapper
            isVisible={isVisible}
            type={toast.type}
            role="alert"
            aria-live="polite"
        >
            <ToastIcon type={toast.type}>
                <i className={`fas fa-${getToastIcon(toast.type)}`} />
            </ToastIcon>
            <ToastContent>
                <ToastTitle>{toast.title}</ToastTitle>
                <ToastMessage>{toast.message}</ToastMessage>
            </ToastContent>
            <ToastClose
                onClick={handleClose}
                aria-label="Close notification"
            >
                <i className="fas fa-times" />
            </ToastClose>
            <ToastProgress duration={duration} type={toast.type} />
        </ToastWrapper>
    );

    return ReactDOM.createPortal(toastElement, document.body);
};