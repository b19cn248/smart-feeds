import React from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 64px);
    padding: 20px;
    text-align: center;
`;

const Icon = styled.div`
    font-size: 48px;
    color: ${({ theme }) => theme.colors.gray[400]};
    margin-bottom: 16px;
`;

const Title = styled.h1`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 16px;
`;

const Message = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 24px;
    max-width: 600px;
`;

export const FavoritesPage: React.FC = () => {
    return (
        <PageContainer>
            <Icon>
                <i className="fas fa-star" />
            </Icon>
            <Title>Favorites</Title>
            <Message>Tính năng chưa phát triển</Message>
            <Button onClick={() => window.history.back()} leftIcon="arrow-left">
                Quay lại
            </Button>
        </PageContainer>
    );
}; 