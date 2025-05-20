import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Container = styled.div`
    padding: 20px;
`;

export const TeamBoardDetailPage: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();

    return (
        <Container>
            <h1>Team Board Detail</h1>
            <p>Board ID: {boardId}</p>
            {/* Add your team board detail content here */}
        </Container>
    );
}; 