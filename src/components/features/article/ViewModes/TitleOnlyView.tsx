// src/components/features/article/ViewModes/TitleOnlyView.tsx
import React from 'react';
import styled from 'styled-components';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';

const TitleList = styled.div`
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    
`;

const TitleItem = styled.div`
    padding: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }

    &:last-child {
        border-bottom: none;
    }
`;

const Title = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 8px 0;
`;

const Meta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const SourceInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const SourceName = styled.span`
    display: flex;
    align-items: center;
    
    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const DateText = styled.span`
    display: flex;
    align-items: center;
    
    &:before {
        content: '•';
        margin: 0 6px;
    }
    
    i {
        margin-right: 6px;
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
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
        <TitleList>
            {articles.map(article => (
                <TitleItem key={article.id} onClick={() => onArticleClick(article)}>
                    <Title>{article.title}</Title>
                    <Meta>
                        <SourceInfo>
                            <SourceName>
                                <i className="fas fa-newspaper" />
                                {typeof article.source === 'string' ? article.source : 'Unknown source'}
                            </SourceName>
                            <DateText>
                                <i className="fas fa-calendar" />
                                {formatDate(new Date(article.publish_date))}
                            </DateText>
                        </SourceInfo>
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
                            <ActionButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(article.url, '_blank');
                                }}
                                title="Open original"
                            >
                                <i className="fas fa-external-link-alt" />
                            </ActionButton>
                        </ActionButtons>
                    </Meta>
                </TitleItem>
            ))}
        </TitleList>
    );
};