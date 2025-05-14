import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/Button';
import { AddArticleFromUrlRequest } from '../../../../types';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const FormLabel = styled.label`
    display: block;
    margin-bottom: 4px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
`;

const FormInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    transition: all 0.2s;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary.main};
        outline: none;
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}40;
    }
`;

const FormTextarea = styled.textarea`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    min-height: 80px;
    resize: vertical;
    transition: all 0.2s;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary.main};
        outline: none;
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}40;
    }
`;

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: 4px;
`;

interface AddArticleFormProps {
    onSubmit: (data: AddArticleFromUrlRequest) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export const AddArticleForm: React.FC<AddArticleFormProps> = ({
                                                                  onSubmit,
                                                                  onCancel,
                                                                  isLoading
                                                              }) => {
    const [articleUrl, setArticleUrl] = useState('');
    const [articleTitle, setArticleTitle] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [articleNote, setArticleNote] = useState('');
    const [urlError, setUrlError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            setUrlError('');
            return true;
        } catch {
            setUrlError('Please enter a valid URL (e.g., https://example.com/article)');
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = articleUrl.trim();
        if (!url) {
            setUrlError('URL is required');
            return;
        }

        if (!validateUrl(url)) {
            return;
        }

        setIsSubmitting(true);

        try {
            const data: AddArticleFromUrlRequest = {
                url,
                title: articleTitle.trim() || undefined,
                content: articleContent.trim() || undefined,
                note: articleNote.trim() || undefined
            };

            await onSubmit(data);

            // Reset form fields
            setArticleUrl('');
            setArticleTitle('');
            setArticleContent('');
            setArticleNote('');
        } catch (error) {
            // The error is already being handled in the parent component
            // with toast notifications, no need to duplicate
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <FormLabel htmlFor="article-url">Article URL (required)</FormLabel>
                <FormInput
                    id="article-url"
                    type="url"
                    value={articleUrl}
                    onChange={(e) => {
                        setArticleUrl(e.target.value);
                        if (urlError && e.target.value) {
                            validateUrl(e.target.value);
                        }
                    }}
                    placeholder="https://example.com/article"
                    required
                    disabled={isLoading || isSubmitting}
                />
                {urlError && <ErrorMessage>{urlError}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
                <FormLabel htmlFor="article-title">Title (optional)</FormLabel>
                <FormInput
                    id="article-title"
                    type="text"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="Enter article title"
                    disabled={isLoading || isSubmitting}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel htmlFor="article-content">Content (optional)</FormLabel>
                <FormTextarea
                    id="article-content"
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Enter article content"
                    rows={4}
                    disabled={isLoading || isSubmitting}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel htmlFor="article-note">Personal note (optional)</FormLabel>
                <FormTextarea
                    id="article-note"
                    value={articleNote}
                    onChange={(e) => setArticleNote(e.target.value)}
                    placeholder="Add a personal note about this article"
                    rows={2}
                    disabled={isLoading || isSubmitting}
                />
            </FormGroup>
            <FormActions>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading || isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading || isSubmitting}
                    disabled={!articleUrl.trim() || isLoading || isSubmitting}
                >
                    Add Article
                </Button>
            </FormActions>
        </Form>
    );
};