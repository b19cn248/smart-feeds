// src/components/common/Card/Card.tsx
import React from 'react';
import styled from 'styled-components';

interface CardProps {
    padding?: string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

const CardContainer = styled.div<{ padding: string }>`
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
    padding: ${props => props.padding};
    transition: ${({ theme }) => theme.transitions.default};
    cursor: ${props => props.onClick ? 'pointer' : 'default'};
    overflow: hidden;
    display: flex; /* Sử dụng flexbox để mở rộng theo container cha */
    flex-direction: column;
    height: 100%; /* Điều này giúp card mở rộng theo chiều cao của container cha */

    &:hover {
        transform: ${props => props.onClick ? 'translateY(-4px)' : 'none'};
        box-shadow: ${props => props.onClick ? props.theme.shadows.lg : props.theme.shadows.md};
    }
`;

export const Card: React.FC<CardProps> = ({
                                              padding = '16px',
                                              onClick,
                                              className,
                                              children
                                          }) => {
    return (
        <CardContainer
            padding={padding}
            onClick={onClick}
            className={className}
        >
            {children}
        </CardContainer>
    );
};