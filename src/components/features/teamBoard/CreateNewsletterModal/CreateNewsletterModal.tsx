// src/components/features/teamBoard/CreateNewsletterModal/CreateNewsletterModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/Button';
import { Input } from '../../../common/Input';
import { Article } from '../../../../types';

// Sử dụng ScheduleType từ TeamBoardNewsletter
export type ScheduleType = 'DAILY' | 'WEEKLY' | 'MONTHLY' |  'IMMEDIATE';

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

const RecipientsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Recipient = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RecipientEmail = styled.div`
  flex: 1;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => `${theme.colors.error}10`};
  }
`;

const NewRecipientRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ArticleSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 10px;
`;

const ArticleItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ selected, theme }) =>
    selected ? `${theme.colors.primary.main}10` : 'transparent'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ selected, theme }) =>
    selected ? `${theme.colors.primary.main}20` : theme.colors.gray[100]};
  }
`;

const ArticleCheckbox = styled.div<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 2px solid ${({ selected, theme }) =>
    selected ? theme.colors.primary.main : theme.colors.gray[300]};
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary.main : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ArticleInfo = styled.div`
  flex: 1;
`;

const ArticleTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: 4px;
`;

const ArticleSource = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const SelectionSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-top: 10px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ScheduleOptions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ScheduleOption = styled.label<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ isSelected, theme }) =>
    isSelected ? `${theme.colors.primary.main}10` : theme.colors.gray[100]};
  border: 1px solid ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary.main : 'transparent'};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ isSelected, theme }) =>
    isSelected ? `${theme.colors.primary.main}20` : theme.colors.gray[200]};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

interface CreateNewsletterModalProps {
    teamBoardId: number;
    articles: Article[];
    onSubmit: (data: {
        title: string;
        recipients: string[];
        articleIds: number[];
        scheduleType: ScheduleType;
    }) => Promise<boolean>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const CreateNewsletterModal: React.FC<CreateNewsletterModalProps> = ({
                                                                                teamBoardId,
                                                                                articles,
                                                                                onSubmit,
                                                                                onCancel,
                                                                                isLoading = false
                                                                            }) => {
    // State for form fields
    const [title, setTitle] = useState<string>('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [newRecipient, setNewRecipient] = useState<string>('');
    const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);
    const [scheduleType, setScheduleType] = useState<ScheduleType>('WEEKLY');

    // Form validation
    const [titleError, setTitleError] = useState<string>('');
    const [recipientError, setRecipientError] = useState<string>('');
    const [selectionError, setSelectionError] = useState<string>('');

    // Email validation function
    const isValidEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Toggle article selection
    const toggleArticleSelection = (articleId: number) => {
        setSelectedArticleIds(prev =>
            prev.includes(articleId)
                ? prev.filter(id => id !== articleId)
                : [...prev, articleId]
        );

        // Clear error if at least one article is selected
        if (!selectedArticleIds.includes(articleId)) {
            setSelectionError('');
        }
    };

    // Add recipient
    const handleAddRecipient = () => {
        if (!newRecipient.trim()) {
            setRecipientError('Please enter an email address');
            return;
        }

        if (!isValidEmail(newRecipient)) {
            setRecipientError('Please enter a valid email address');
            return;
        }

        if (recipients.includes(newRecipient)) {
            setRecipientError('This email is already added');
            return;
        }

        setRecipients([...recipients, newRecipient]);
        setNewRecipient('');
        setRecipientError('');
    };

    // Remove recipient
    const handleRemoveRecipient = (email: string) => {
        setRecipients(recipients.filter(r => r !== email));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate fields
        let hasError = false;

        if (!title.trim()) {
            setTitleError('Newsletter title is required');
            hasError = true;
        }

        if (recipients.length === 0) {
            setRecipientError('At least one recipient is required');
            hasError = true;
        }

        if (selectedArticleIds.length === 0) {
            setSelectionError('Please select at least one article');
            hasError = true;
        }

        if (hasError) return;

        // Submit form
        const success = await onSubmit({
            title,
            recipients,
            articleIds: selectedArticleIds,
            scheduleType,
        });

        if (success) {
            // Reset form on success
            setTitle('');
            setRecipients([]);
            setNewRecipient('');
            setSelectedArticleIds([]);
            setScheduleType('WEEKLY');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <FormLabel htmlFor="newsletter-title">Newsletter Title</FormLabel>
                <Input
                    id="newsletter-title"
                    placeholder="Enter newsletter title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (e.target.value.trim()) {
                            setTitleError('');
                        }
                    }}
                    error={titleError}
                    disabled={isLoading}
                    required
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>Recipients</FormLabel>
                <RecipientsContainer>
                    {recipients.length > 0 && recipients.map((email, index) => (
                        <Recipient key={index}>
                            <RecipientEmail>{email}</RecipientEmail>
                            <RemoveButton
                                type="button"
                                onClick={() => handleRemoveRecipient(email)}
                                disabled={isLoading}
                                title="Remove recipient"
                            >
                                <i className="fas fa-times" />
                            </RemoveButton>
                        </Recipient>
                    ))}

                    <NewRecipientRow>
                        <div style={{ flex: 1 }}>
                            <Input
                                placeholder="Enter email address"
                                value={newRecipient}
                                onChange={(e) => {
                                    setNewRecipient(e.target.value);
                                    if (e.target.value.trim() && isValidEmail(e.target.value)) {
                                        setRecipientError('');
                                    }
                                }}
                                error={recipientError}
                                leftIcon="envelope"
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleAddRecipient}
                            disabled={isLoading}
                        >
                            Add
                        </Button>
                    </NewRecipientRow>
                </RecipientsContainer>
            </FormGroup>

            <FormGroup>
                <FormLabel>Select Articles</FormLabel>
                {selectionError && (
                    <div style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>
                        {selectionError}
                    </div>
                )}
                <ArticleSelection>
                    {articles.length > 0 ? (
                        <>
                            {articles.map((article) => (
                                <ArticleItem
                                    key={article.id}
                                    selected={selectedArticleIds.includes(article.id)}
                                    onClick={() => toggleArticleSelection(article.id)}
                                >
                                    <ArticleCheckbox selected={selectedArticleIds.includes(article.id)}>
                                        {selectedArticleIds.includes(article.id) && (
                                            <i className="fas fa-check" style={{ fontSize: '12px' }} />
                                        )}
                                    </ArticleCheckbox>
                                    <ArticleInfo>
                                        <ArticleTitle>{article.title}</ArticleTitle>
                                        <ArticleSource>{article.source}</ArticleSource>
                                    </ArticleInfo>
                                </ArticleItem>
                            ))}
                            <SelectionSummary>
                                <span>{selectedArticleIds.length} article(s) selected</span>
                                {selectedArticleIds.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedArticleIds([])}
                                        disabled={isLoading}
                                    >
                                        Clear Selection
                                    </Button>
                                )}
                            </SelectionSummary>
                        </>
                    ) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                            No articles available in this team board.
                        </div>
                    )}
                </ArticleSelection>
            </FormGroup>

            <FormGroup>
                <FormLabel>Schedule Frequency</FormLabel>
                <ScheduleOptions>
                    <ScheduleOption
                        isSelected={scheduleType === 'DAILY'}
                        onClick={() => setScheduleType('DAILY')}
                    >
                        <input
                            type="radio"
                            name="scheduleType"
                            checked={scheduleType === 'DAILY'}
                            onChange={() => setScheduleType('DAILY')}
                            disabled={isLoading}
                        />
                        <div>Daily</div>
                    </ScheduleOption>

                    <ScheduleOption
                        isSelected={scheduleType === 'WEEKLY'}
                        onClick={() => setScheduleType('WEEKLY')}
                    >
                        <input
                            type="radio"
                            name="scheduleType"
                            checked={scheduleType === 'WEEKLY'}
                            onChange={() => setScheduleType('WEEKLY')}
                            disabled={isLoading}
                        />
                        <div>Weekly</div>
                    </ScheduleOption>

                    <ScheduleOption
                        isSelected={scheduleType === 'MONTHLY'}
                        onClick={() => setScheduleType('MONTHLY')}
                    >
                        <input
                            type="radio"
                            name="scheduleType"
                            checked={scheduleType === 'MONTHLY'}
                            onChange={() => setScheduleType('MONTHLY')}
                            disabled={isLoading}
                        />
                        <div>Monthly</div>
                    </ScheduleOption>

                    <ScheduleOption
                        isSelected={scheduleType === 'IMMEDIATE'}
                        onClick={() => setScheduleType('IMMEDIATE')}
                    >
                        <input
                            type="radio"
                            name="scheduleType"
                            checked={scheduleType === 'IMMEDIATE'}
                            onChange={() => setScheduleType('IMMEDIATE')}
                            disabled={isLoading}
                        />
                        <div>Immediate</div>
                    </ScheduleOption>
                </ScheduleOptions>
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
                    disabled={
                        isLoading ||
                        !title.trim() ||
                        recipients.length === 0 ||
                        selectedArticleIds.length === 0
                    }
                >
                    Create Newsletter
                </Button>
            </Actions>
        </Form>
    );
};