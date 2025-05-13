// src/components/common/Textarea/Textarea.tsx
import React from 'react';
import styled from 'styled-components';

const TextareaWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Label = styled.label`
    margin-bottom: 8px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledTextarea = styled.textarea<{ hasError?: boolean }>`
    padding: 10px 14px;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.gray[300]};
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    resize: vertical;
    min-height: 100px;
    width: 100%;
    transition: ${({ theme }) => theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.primary.main};
        box-shadow: 0 0 0 3px ${({ theme, hasError }) =>
    hasError ? `${theme.colors.error}40` : `${theme.colors.primary.light}40`};
    }

    @media (prefers-color-scheme: dark) {
        border-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.gray[600]};
        background-color: ${({ theme }) => theme.colors.gray[800]};

        &:focus {
            border-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.primary.main};
        }
    }
`;

const HelperText = styled.div<{ isError?: boolean }>`
    margin-top: 6px;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.text.secondary};
`;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
                                                      label,
                                                      error,
                                                      helperText,
                                                      id,
                                                      ...rest
                                                  }) => {
    const uniqueId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    return (
        <TextareaWrapper>
            {label && <Label htmlFor={uniqueId}>{label}</Label>}

            <StyledTextarea
                id={uniqueId}
                hasError={!!error}
                aria-invalid={!!error}
                {...rest}
            />

            {(error || helperText) && (
                <HelperText isError={!!error}>
                    {error || helperText}
                </HelperText>
            )}
        </TextareaWrapper>
    );
};