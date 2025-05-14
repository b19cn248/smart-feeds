// src/components/common/Input/Input.tsx
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { InputProps } from '../../../types';

const InputWrapper = styled.div<{ isFullWidth?: boolean }>`
    width: ${props => props.isFullWidth ? '100%' : 'auto'};
    position: relative;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
    color: ${props => props.theme.colors.text.primary};
`;

const InputContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input<{ hasError?: boolean; hasLeftIcon?: boolean; hasRightIcon?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    border: 1px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.gray[300]};
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background.secondary};

    &:focus {
        border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary.main};
        outline: none;
        box-shadow: 0 0 0 3px ${props => props.hasError ? props.theme.colors.error + '20' : props.theme.colors.primary.main + '20'};
    }

    &::placeholder {
        color: ${props => props.theme.colors.gray[500]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    ${props => props.hasLeftIcon && css`
        padding-left: 40px;
    `}

    ${props => props.hasRightIcon && css`
        padding-right: 40px;
    `}
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.gray[500]};
    font-size: 14px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;

    ${props => props.position === 'left' ? css`
        left: 14px;
    ` : css`
        right: 14px;
    `}
`;

const HelperText = styled.div<{ hasError?: boolean }>`
    margin-top: 6px;
    font-size: 13px;
    color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.text.secondary};
    display: flex;
    align-items: center;

    i {
        margin-right: 6px;
        font-size: 12px;
    }
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(({
                                                                   label,
                                                                   error,
                                                                   helperText,
                                                                   leftIcon,
                                                                   rightIcon,
                                                                   isFullWidth,
                                                                   className,
                                                                   id,
                                                                   ...props
                                                               }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
        <InputWrapper isFullWidth={isFullWidth} className={className}>
            {label && (
                <Label htmlFor={inputId}>{label}</Label>
            )}
            <InputContainer>
                {leftIcon && (
                    <IconWrapper position="left">
                        <i className={`fas fa-${leftIcon}`} />
                    </IconWrapper>
                )}
                <StyledInput
                    id={inputId}
                    ref={ref}
                    hasError={hasError}
                    hasLeftIcon={Boolean(leftIcon)}
                    hasRightIcon={Boolean(rightIcon)}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${inputId}-error` : undefined}
                    {...props}
                />
                {rightIcon && (
                    <IconWrapper position="right">
                        <i className={`fas fa-${rightIcon}`} />
                    </IconWrapper>
                )}
            </InputContainer>
            {(error || helperText) && (
                <HelperText
                    hasError={hasError}
                    id={hasError ? `${inputId}-error` : undefined}
                    role={hasError ? "alert" : undefined}
                >
                    {hasError && <i className="fas fa-exclamation-circle" />}
                    {error || helperText}
                </HelperText>
            )}
        </InputWrapper>
    );
});

Input.displayName = 'Input';