// src/components/common/Button/Button.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { ButtonProps } from '../../../types';
import { buttonReset, hoverLift, disabled } from '../../../styles/mixins';

const getVariantStyles = (variant: ButtonProps['variant'] = 'primary') => {
    switch (variant) {
        case 'secondary':
            return css`
        background: transparent;
        border: 1px solid ${({ theme }) => theme.colors.primary.main};
        color: ${({ theme }) => theme.colors.primary.main};

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.primary.light};
          border-color: ${({ theme }) => theme.colors.primary.hover};
          color: ${({ theme }) => theme.colors.primary.hover};
        }
      `;
        case 'ghost':
            return css`
        background: transparent;
        border: none;
        color: ${({ theme }) => theme.colors.text.secondary};

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.gray[100]};
          color: ${({ theme }) => theme.colors.text.primary};
        }

        @media (prefers-color-scheme: dark) {
          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.gray[800]};
          }
        }
      `;
        default: // primary
            return css`
        background: ${({ theme }) => theme.colors.primary.main};
        border: none;
        color: white;

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.primary.hover};
        }
      `;
    }
};

const getSizeStyles = (size: ButtonProps['size'] = 'md') => {
    switch (size) {
        case 'sm':
            return css`
        padding: 8px 12px;
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
      `;
        case 'lg':
            return css`
        padding: 12px 20px;
        font-size: ${({ theme }) => theme.typography.fontSize.lg};
      `;
        default: // md
            return css`
        padding: 10px 16px;
        font-size: ${({ theme }) => theme.typography.fontSize.md};
      `;
    }
};

const StyledButton = styled.button<ButtonProps>`
  ${buttonReset}
  ${hoverLift}
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  white-space: nowrap;
  
  ${({ size }) => getSizeStyles(size)}
  ${({ variant }) => getVariantStyles(variant)}
  
  ${({ isFullWidth }) => isFullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    ${disabled}
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light};
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  
  &.left {
    margin-right: 8px;
  }
  
  &.right {
    margin-left: 8px;
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  leftIcon,
                                                  rightIcon,
                                                  isLoading,
                                                  disabled,
                                                  ...props
                                              }) => {
    return (
        <StyledButton
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {leftIcon && (
                        <IconWrapper className="left">
                            <i className={`fas fa-${leftIcon}`} />
                        </IconWrapper>
                    )}
                    {children}
                    {rightIcon && (
                        <IconWrapper className="right">
                            <i className={`fas fa-${rightIcon}`} />
                        </IconWrapper>
                    )}
                </>
            )}
        </StyledButton>
    );
};
