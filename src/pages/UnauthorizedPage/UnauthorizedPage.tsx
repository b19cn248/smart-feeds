// src/pages/UnauthorizedPage/UnauthorizedPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 96px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin: 0;
  line-height: 1;
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 16px 0;
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 32px;
  max-width: 500px;
`;

export const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <PageWrapper>
            <ErrorCode>403</ErrorCode>
            <ErrorTitle>Access Denied</ErrorTitle>
            <ErrorMessage>
                You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
            </ErrorMessage>
            <div style={{ display: 'flex', gap: '16px' }}>
                <Button variant="secondary" onClick={handleGoBack}>
                    Go Back
                </Button>
                <Button onClick={handleGoHome}>
                    Go to Home
                </Button>
            </div>
        </PageWrapper>
    );
};
