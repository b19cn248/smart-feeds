// src/styles/mixins/articleMixins.ts
import { css } from 'styled-components';

export const articleCardStyle = css`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.default};
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

export const articleTitleStyle = css`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

export const articleExcerptStyle = css`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 16px 0;
  line-height: 1.6;
`;

export const articleImageStyle = css`
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

export const articleMetaStyle = css`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const articleContentStyle = css`
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
  
  h1, h2, h3, h4, h5, h6 {
    margin: 24px 0 16px 0;
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

export default {
    articleCardStyle,
    articleTitleStyle,
    articleExcerptStyle,
    articleImageStyle,
    articleMetaStyle,
    articleContentStyle
};