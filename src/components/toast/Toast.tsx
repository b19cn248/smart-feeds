import React from 'react';
import styled from 'styled-components';
import { Toast as ToastType, ToastType as ToastVariant } from '../../types';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1001;
`;

const ToastWrapper = styled.div<{ isVisible: boolean; type: ToastVariant }>`
  background-color: white;
  color: var(--text-primary);
  padding: 0;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: stretch;
  max-width: 320px;
  overflow: hidden;
  transition: var(--transition);
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(20px)'};
  border: 1px solid var(--light-gray);

  @media (max-width: 576px) {
    max-width: 90%;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1E293B;
    border-color: var(--light-gray);
  }
`;

const getToastColor = (type: ToastVariant) => {
    switch (type) {
        case 'success': return 'var(--success)';
        case 'error': return 'var(--error)';
        case 'warning': return '#FBBF24';
        case 'info': return 'var(--primary)';
        default: return 'var(--success)';
    }
};

const getToastIcon = (type: ToastVariant) => {
    switch (type) {
        case 'success': return 'check';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'check';
    }
};

const ToastIcon = styled.div<{ type: ToastVariant }>`
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => getToastColor(props.type)};
  color: white;
  font-size: 18px;
`;

const ToastContent = styled.div`
  flex: 1;
  padding: 12px 16px;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
`;

const ToastMessage = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

const ToastClose = styled.button`
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--dark-gray);
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition);

  &:hover {
    color: var(--text-primary);
    background-color: var(--light-gray);
  }
`;

const ToastProgress = styled.div<{ type: ToastVariant }>`
  height: 3px;
  background-color: var(--medium-gray);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: ${props => getToastColor(props.type)};
    animation: progress 3s linear forwards;
  }

  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

interface ToastProps {
    toast: ToastType | null;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    if (!toast) return null;

    return (
        <ToastContainer>
            <ToastWrapper isVisible={!!toast} type={toast.type}>
                <ToastIcon type={toast.type}>
                    <i className={`fas fa-${getToastIcon(toast.type)}`}></i>
                </ToastIcon>
                <ToastContent>
                    <ToastTitle>{toast.title}</ToastTitle>
                    <ToastMessage>{toast.message}</ToastMessage>
                </ToastContent>
                <ToastClose onClick={onClose}>
                    <i className="fas fa-times"></i>
                </ToastClose>
                <ToastProgress type={toast.type} />
            </ToastWrapper>
        </ToastContainer>
    );
};

export default Toast;