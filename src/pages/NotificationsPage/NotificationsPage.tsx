// src/pages/Discover/DiscoverPage.tsx
import React from 'react';
import { Box, Container } from '@mui/material';
import styled from 'styled-components';
import { Theme } from '../../styles/theme';

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}

const StyledContainer = styled(Container)`
    min-height: calc(100vh - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
`;

const StyledBox = styled(Box)`
    text-align: center;
    padding: 2rem;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.text.primary};
    max-width: 400px;
    margin: 0 auto;
`;

const NotificationsPage: React.FC = () => {
    return (
        <StyledContainer>
            <StyledBox>
                <Title>
                    Tính năng chưa phát triển
                </Title>
                <Subtitle>
                    Tính năng này đang được phát triển và sẽ sớm ra mắt.
                </Subtitle>
            </StyledBox>
        </StyledContainer>
    );
};

export default NotificationsPage;