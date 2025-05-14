// src/pages/Discover/DiscoverPage.tsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary || '#f5f5f5'};
`;

const Message = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg || '24px'};
  color: ${({ theme }) => theme.colors.text.primary || '#333'};
  text-align: center;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radii.md || '8px'};
  background-color: ${({ theme }) => theme.colors.background.secondary || '#fff'};
  box-shadow: ${({ theme }) => theme.shadows.sm || '0 2px 4px rgba(0, 0, 0, 0.1)'};
`;

const DiscoverPage: React.FC = () => {
  return (
    <Container>
      <Message>Tính năng đang phát triển</Message>
    </Container>
  );
};

export default DiscoverPage;