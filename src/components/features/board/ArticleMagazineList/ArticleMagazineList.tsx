// src/components/features/board/ArticleMagazineList/ArticleMagazineList.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { ArticleMagazineItem } from '../ArticleMagazineItem';
import { Button } from '../../../common/Button';

const MagazineList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 48px 0;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
`;

const EmptyStateIcon = styled.div`
    font-size: 48px;
    color: ${({ theme }) => theme.colors.gray[400]};
    margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 24px;
`;

interface ArticleMagazineListProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
    onDeleteClick: (article: Article) => void;
    onAddArticleClick: () => void;
}

export const ArticleMagazineList: React.FC<ArticleMagazineListProps> = ({
                                                                            articles,
                                                                            onArticleClick,
                                                                            onDeleteClick,
                                                                            onAddArticleClick
                                                                        }) => {
    if (!articles || articles.length === 0) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <i className="fas fa-newspaper" />
                </EmptyStateIcon>
                <EmptyStateText>
                    No articles in this board yet
                </EmptyStateText>
                <Button onClick={onAddArticleClick} leftIcon="plus">
                    Add Article
                </Button>
            </EmptyState>
        );
    }

    return (
        <MagazineList>
            {articles.map((article) => (
                <ArticleMagazineItem
                    key={article.id}
                    article={article}
                    onArticleClick={onArticleClick}
                    onDeleteClick={onDeleteClick}
                />
            ))}
        </MagazineList>
    );
};