import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTeamBoard } from '../../../../contexts/TeamBoardContext';
import { TeamBoardNote } from '../../../../types';
import { Button } from '../../../common/Button';
import { Input } from '../../../common/Input';
import { formatDate } from '../../../../utils';

const NotesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
`;

const NotesHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const NotesTitle = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
`;

const NotesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const NoteItem = styled.div`
    padding: 12px;
    background-color: ${({ theme }) => theme.colors.background.primary};
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const NoteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

const NoteAuthor = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoteTime = styled.span`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoteContent = styled.div`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    white-space: pre-wrap;
    word-break: break-word;
`;

const NoteForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const NoteTextarea = styled(Input).attrs({ as: 'textarea' })`
    min-height: 100px;
    resize: vertical;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const SubmitButton = styled(Button).attrs({ type: 'submit' })`
    // Add any additional styles here
`;

interface ArticleNotesProps {
    boardId: number;
    articleId: number;
}

export const ArticleNotes: React.FC<ArticleNotesProps> = ({ boardId, articleId }) => {
    const { getArticleNotes, addArticleNote } = useTeamBoard();
    const [notes, setNotes] = useState<TeamBoardNote[]>([]);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mentionedUserIds, setMentionedUserIds] = useState<number[]>([]);

    useEffect(() => {
        loadNotes();
    }, [boardId, articleId]);

    const loadNotes = async () => {
        try {
            const response = await getArticleNotes(boardId, articleId);
            setNotes(response.data);
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Form submitted', { boardId, articleId, newNote, mentionedUserIds });
        
        if (!newNote.trim()) {
            console.log('Note is empty, returning');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Calling addArticleNote');
            const success = await addArticleNote(boardId, articleId, newNote, mentionedUserIds);
            console.log('addArticleNote result:', success);
            
            if (success) {
                setNewNote('');
                setMentionedUserIds([]);
                setIsAddingNote(false);
                await loadNotes();
            }
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMention = (userId: number) => {
        setMentionedUserIds(prev => [...prev, userId]);
    };

    return (
        <NotesContainer>
            <NotesHeader>
                <NotesTitle>Notes</NotesTitle>
                {!isAddingNote && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingNote(true)}
                        leftIcon="plus"
                    >
                        Add Note
                    </Button>
                )}
            </NotesHeader>

            {isAddingNote && (
                <NoteForm onSubmit={handleSubmit}>
                    <NoteTextarea
                        placeholder="Add a note... Use @ to mention team members"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <ButtonGroup>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setIsAddingNote(false);
                                setNewNote('');
                                setMentionedUserIds([]);
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <SubmitButton
                            disabled={!newNote.trim() || isSubmitting}
                            isLoading={isSubmitting}
                        >
                            Save
                        </SubmitButton>
                    </ButtonGroup>
                </NoteForm>
            )}

            <NotesList>
                {notes.map((note) => (
                    <NoteItem key={note.id}>
                        <NoteHeader>
                            <NoteAuthor>
                                <i className="fas fa-user" />
                                {note.created_by_name}
                            </NoteAuthor>
                            <NoteTime>{formatDate(new Date(note.created_at))}</NoteTime>
                        </NoteHeader>
                        <NoteContent>{note.content}</NoteContent>
                    </NoteItem>
                ))}
            </NotesList>
        </NotesContainer>
    );
}; 