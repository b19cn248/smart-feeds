// src/components/features/article/EnhancedArticleDetail/ShareModal.tsx
import React from 'react';
import styled from 'styled-components';
import { useToast } from '../../../../contexts/ToastContext';
import { Article } from '../../../../types';
import { FolderArticle } from '../../../../types/folderArticles.types';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 500px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ShareOptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

const ShareOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 16px;
  width: calc(25% - 9px);
  min-width: 80px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary.light};
  }

  i {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary.main};
  }

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.colors.gray[700]};

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[800]};
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: calc(50% - 6px);
  }
`;

const ShareInput = styled.div`
  position: relative;
  margin-bottom: 20px;

  input {
    width: 100%;
    padding: 12px 120px 12px 16px;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.primary};

    @media (prefers-color-scheme: dark) {
      border-color: ${({ theme }) => theme.colors.gray[600]};
      background-color: ${({ theme }) => theme.colors.gray[800]};
    }
  }

  button {
    position: absolute;
    right: 4px;
    top: 4px;
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.radii.md};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary.hover};
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[200]};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[700]};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[600]};
    }
  }
`;

interface ShareModalProps {
    article: Article | FolderArticle;
    onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ article, onClose }) => {
    const { showToast } = useToast();

    const handleShare = (platform: string) => {
        let shareUrl = '';
        const text = encodeURIComponent(`${article.title} | ${article.url}`);

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
        onClose();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(article.url)
            .then(() => {
                showToast('success', 'Success', 'URL copied to clipboard');
            })
            .catch(() => {
                showToast('error', 'Error', 'Failed to copy URL');
            });
    };

    return (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <ModalContainer>
                <ModalTitle>Share Article</ModalTitle>
                <ShareOptionsList>
                    <ShareOption onClick={() => handleShare('twitter')}>
                        <i className="fab fa-twitter" />
                        <span>Twitter</span>
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('facebook')}>
                        <i className="fab fa-facebook" />
                        <span>Facebook</span>
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('linkedin')}>
                        <i className="fab fa-linkedin" />
                        <span>LinkedIn</span>
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('email')}>
                        <i className="fas fa-envelope" />
                        <span>Email</span>
                    </ShareOption>
                </ShareOptionsList>

                <ShareInput>
                    <input type="text" value={article.url} readOnly />
                    <button onClick={copyToClipboard}>Copy</button>
                </ShareInput>

                <ModalFooter>
                    <CloseButton onClick={onClose}>Close</CloseButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};