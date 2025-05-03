// src/components/common/Card/Card.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { CardProps } from '../../../types';

const StyledCard = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.default};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.gray[300]};
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
    border-color: ${({ theme }) => theme.colors.gray[700]};
  }
  
  ${({ onClick }) => onClick && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }

    &:active {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  `}
  
  padding: ${({ padding, theme }) => padding || theme.spacing.xl};
  
  ${({ variant }) => variant === 'outlined' && css`
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    
    &:hover {
      box-shadow: none;
      border-color: ${({ theme }) => theme.colors.gray[300]};
    }
    
    @media (prefers-color-scheme: dark) {
      border-color: ${({ theme }) => theme.colors.gray[700]};
      
      &:hover {
        border-color: ${({ theme }) => theme.colors.gray[600]};
      }
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
                                              children,
                                              variant = 'elevated',
                                              padding,
                                              onClick,
                                              className,
                                          }) => {
    return (
        <StyledCard
            variant={variant}
            padding={padding}
            onClick={onClick}
            className={className}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </StyledCard>
    );
};