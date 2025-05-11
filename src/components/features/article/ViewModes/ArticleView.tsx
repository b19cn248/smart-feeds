// src/components/features/article/ViewModes/ArticleView.tsx
import React from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { Article } from '../../../../types';
import { formatDate } from '../../../../utils';

const DEFAULT_ARTICLE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

const ArticleContainer = styled.article`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const ArticleHeader = styled.header`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Source = styled.div`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 6px;
  }
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 6px;
  }
`;

const PublishDate = styled.div`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 6px;
  }
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 24px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: 24px;
  
  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[700]};
    }
  }
  
  i {
    font-size: 14px;
  }
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.7;
  
  p {
    margin-bottom: 16px;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.radii.md};
    margin: 16px 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  h2, h3, h4, h5, h6 {
    margin: 24px 0 16px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
  
  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
  }
  
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
    padding-left: 16px;
    margin: 16px 0;
    font-style: italic;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ReadMoreLink = styled.a`
  display: inline-block;
  margin-top: 24px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.hover};
    transform: translateY(-2px);
  }
  
  i {
    margin-left: 8px;
  }
`;

interface ArticleViewProps {
    article: Article;
    onSaveArticle?: (article: Article) => void;
    onShareArticle?: (article: Article) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
                                                            article,
                                                            onSaveArticle,
                                                            onShareArticle
                                                        }) => {
    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(article.content);

    return (
        <ArticleContainer>
            <ArticleHeader>
                <Title>{article.title}</Title>
                <Meta>
                    <Source>
                        <i className="fas fa-newspaper" />
                        {typeof article.source === 'string' ? article.source : 'Unknown source'}
                    </Source>
                    {article.author && (
                        <Author>
                            <i className="fas fa-user" />
                            {article.author}
                        </Author>
                    )}
                    <PublishDate>
                        <i className="fas fa-calendar" />
                        {formatDate(new Date(article.publish_date))}
                    </PublishDate>
                </Meta>

                {article.image_url && (
                    <FeaturedImage
                        src={article.image_url || DEFAULT_ARTICLE_IMAGE}
                        alt={article.title}
                        onError={(e) => {
                            e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
                        }}
                    />
                )}

                <ActionBar>
                    <ActionGroup>
                        <ActionButton title="Mark as read">
                            <i className="fas fa-check" />
                            <span>Mark as read</span>
                        </ActionButton>
                        {onSaveArticle && (
                            <ActionButton
                                title="Save to board"
                                onClick={() => onSaveArticle(article)}
                            >
                                <i className="fas fa-bookmark" />
                                <span>Save</span>
                            </ActionButton>
                        )}
                    </ActionGroup>
                    <ActionGroup>
                        {onShareArticle && (
                            <ActionButton
                                title="Share article"
                                onClick={() => onShareArticle(article)}
                            >
                                <i className="fas fa-share" />
                                <span>Share</span>
                            </ActionButton>
                        )}
                    </ActionGroup>
                </ActionBar>
            </ArticleHeader>

            <Content dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

            <ReadMoreLink href={article.url} target="_blank" rel="noopener noreferrer">
                Read full article on original site
                <i className="fas fa-external-link-alt" />
            </ReadMoreLink>
        </ArticleContainer>
    );
};