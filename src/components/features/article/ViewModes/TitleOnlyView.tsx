// src/components/features/article/ViewModes/TitleOnlyView.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';

const TitleItem = styled.div`
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    @media (prefers-color-scheme: dark) {
        border-bottom-color: ${({ theme }) => theme.colors.gray[700]};

        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

const TitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`;

const Title = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    padding-right: 12px;
`;

const Meta = styled.div`
    display: flex;
    align-items: center;
    margin-top: 4px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const SourceName = styled.span`
    margin-right: 8px;
`;

const DateText = styled.span`
    &:before {
        content: '•';
        margin: 0 6px;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 4px;
    margin-top: 4px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: 14px;
    cursor: pointer;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};

    &:hover {
        color: ${({ theme }) => theme.colors.primary.main};
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    @media (prefers-color-scheme: dark) {
        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
        }
    }
`;

interface TitleOnlyViewProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
    onSaveArticle?: (article: Article) => void;
}

export const TitleOnlyView: React.FC<TitleOnlyViewProps> = ({
                                                                articles,
                                                                onArticleClick,
                                                                onSaveArticle
                                                            }) => {
    return (
        <div>
            {articles.map(article => (
                <TitleItem key={article.id} onClick={() => onArticleClick(article)}>
                    <TitleRow>
                        <Title>{article.title}</Title>
                    </TitleRow>
                    <Meta>
                        <SourceName>
                            {typeof article.source === 'string' ? article.source : 'Unknown source'}
                        </SourceName>
                        <DateText>{formatDate(new Date(article.publish_date))}</DateText>
                    </Meta>
                    <ActionButtons>
                        {onSaveArticle && (
                            <ActionButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSaveArticle(article);
                                }}
                                title="Save to board"
                            >
                                <i className="fas fa-bookmark" />
                            </ActionButton>
                        )}
                    </ActionButtons>
                </TitleItem>
            ))}
        </div>
    );
};