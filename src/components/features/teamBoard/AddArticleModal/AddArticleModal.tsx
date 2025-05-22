// src/components/features/teamBoard/AddArticleModal/AddArticleModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/Button';
import { Input } from '../../../common/Input';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

interface AddArticleModalProps {
    onSubmit: (articleId: number) => Promise<boolean>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AddArticleModal: React.FC<AddArticleModalProps> = ({
                                                                    onSubmit,
                                                                    onCancel,
                                                                    isLoading = false
                                                                }) => {
    const [articleId, setArticleId] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!articleId.trim() || isNaN(Number(articleId))) {
            setError('Please enter a valid article ID (number)');
            return;
        }

        const id = parseInt(articleId, 10);
        const success = await onSubmit(id);

        if (success) {
            onCancel();
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <FormLabel htmlFor="article-id">Article ID</FormLabel>
                <Input
                    id="article-id"
                    type="number"
                    placeholder="Enter article ID"
                    value={articleId}
                    onChange={(e) => {
                        setArticleId(e.target.value);
                        if (error) setError('');
                    }}
                    error={error}
                    disabled={isLoading}
                    required
                />
            </FormGroup>

            <Actions>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!articleId.trim() || isLoading}
                >
                    Add Article
                </Button>
            </Actions>
        </Form>
    );
};