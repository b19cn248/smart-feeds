import React from 'react';
import { Article } from '../../../types';
import { EnhancedArticleDetail } from './EnhancedArticleDetail/EnhancedArticleDetail';

interface TeamBoardArticleDetailProps {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
    teamBoardId: string;
}

export const TeamBoardArticleDetail: React.FC<TeamBoardArticleDetailProps> = ({
    article,
    isOpen,
    onClose,
    teamBoardId
}) => {
    return (
        <EnhancedArticleDetail
            article={article}
            isOpen={isOpen}
            onClose={onClose}
            teamBoardId={teamBoardId}
        />
    );
}; 