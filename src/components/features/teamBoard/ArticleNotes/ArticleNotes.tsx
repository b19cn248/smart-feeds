import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTeamBoard } from '../../../../contexts/TeamBoardContext';
import { TeamBoardNote } from '../../../../types';
import { Button } from '../../../common/Button';
import { Input } from '../../../common/Input';
import { formatDate } from '../../../../utils';
import { useToast } from '../../../../contexts/ToastContext';

const NotesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const NotesHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const NotesTitle = styled.h3`
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const NotesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const NoteItem = styled.div`
    padding: 12px;
    background-color: ${({ theme }) => theme.colors.background.primary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};
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
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const NoteTime = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoteContent = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const SubmitButton = styled(Button).attrs({ type: 'submit' })``;

const NoteTextarea = styled(Input).attrs({ as: 'textarea' })`
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
`;

const FormattingToolbar = styled.div`
    display: flex;
    gap: 8px;
    padding: 8px;
    background-color: ${({ theme }) => theme.colors.background.primary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-bottom: none;
    border-radius: ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0 0;
`;

const FormatButton = styled.button<{ active?: boolean }>`
    background: none;
    border: none;
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.radii.sm};
    color: ${({ active, theme }) => active ? theme.colors.primary.main : theme.colors.text.secondary};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }
`;

const MentionSuggestions = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.background.primary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.radii.md};
    box-shadow: ${({ theme }) => theme.shadows.md};
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
`;

const MentionSuggestion = styled.div<{ selected?: boolean }>`
    padding: 8px 12px;
    cursor: pointer;
    background-color: ${({ selected, theme }) => selected ? theme.colors.gray[100] : 'transparent'};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
    }
`;

const NoteForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
`;

interface ArticleNotesProps {
    boardId: number;
    articleId: number;
}

export const ArticleNotes: React.FC<ArticleNotesProps> = ({ boardId, articleId }) => {
    const { getArticleNotes, addArticleNote } = useTeamBoard();
    const { showToast } = useToast();
    const [notes, setNotes] = useState<TeamBoardNote[]>([]);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mentionedUserIds, setMentionedUserIds] = useState<number[]>([]);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionSearch, setMentionSearch] = useState('');
    const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Mock data for user suggestions - replace with actual API call
    const userSuggestions = [
        { id: 1, name: 'Nguyen', email: 'nguyen@company.com' },
        { id: 2, name: 'Minh', email: 'minh@company.com' },
        { id: 3, name: 'Anh', email: 'anh@company.com' },
    ];

    useEffect(() => {
        loadNotes();
    }, [boardId, articleId]);

    const loadNotes = async () => {
        try {
            const response = await getArticleNotes(boardId, articleId);
            console.log('Notes response:', response);
            if (response && response.data) {
                setNotes(response.data);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            showToast('error', 'Error', 'Failed to load notes');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('handleSubmit called', { boardId, articleId, newNote, mentionedUserIds });
        
        if (!newNote.trim()) {
            console.log('Note is empty, returning');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Calling addArticleNote...');
            const success = await addArticleNote(boardId, articleId, newNote, mentionedUserIds);
            console.log('addArticleNote result:', success);
            
            if (success) {
                setNewNote('');
                setMentionedUserIds([]);
                setIsAddingNote(false);
                await loadNotes();
                showToast('success', 'Success', 'Note added successfully');
            }
        } catch (error) {
            console.error('Error adding note:', error);
            showToast('error', 'Error', 'Failed to add note');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNewNote(value);
        
        // Handle @ mentions
        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPos);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
        
        if (mentionMatch) {
            setShowMentions(true);
            setMentionSearch(mentionMatch[1]);
            setCursorPosition(cursorPos);
            setSelectedMentionIndex(0);
        } else {
            setShowMentions(false);
        }
    };

    const handleMentionSelect = (user: { id: number; name: string; email: string }) => {
        const beforeMention = newNote.substring(0, cursorPosition - mentionSearch.length - 1);
        const afterMention = newNote.substring(cursorPosition);
        const newText = `${beforeMention}@${user.name} ${afterMention}`;
        
        setNewNote(newText);
        setMentionedUserIds([...mentionedUserIds, user.id]);
        setShowMentions(false);
        
        // Focus back on textarea and set cursor position
        if (textareaRef.current) {
            const newCursorPos = beforeMention.length + user.name.length + 2; // +2 for @ and space
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedMentionIndex(prev => 
                    prev < userSuggestions.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : prev);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleMentionSelect(userSuggestions[selectedMentionIndex]);
            } else if (e.key === 'Escape') {
                setShowMentions(false);
            }
        }
    };

    const filteredSuggestions = userSuggestions.filter(user =>
        user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(mentionSearch.toLowerCase())
    );

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
                    <FormattingToolbar>
                        <FormatButton type="button" title="Bold">
                            <i className="fas fa-bold" />
                        </FormatButton>
                        <FormatButton type="button" title="Italic">
                            <i className="fas fa-italic" />
                        </FormatButton>
                        <FormatButton type="button" title="Bullet List">
                            <i className="fas fa-list-ul" />
                        </FormatButton>
                    </FormattingToolbar>
                    <NoteTextarea
                        ref={textareaRef}
                        placeholder="Add a note... Use @ to mention team members"
                        value={newNote}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                    />
                    {showMentions && (
                        <MentionSuggestions>
                            {filteredSuggestions.map((user, index) => (
                                <MentionSuggestion
                                    key={user.id}
                                    selected={index === selectedMentionIndex}
                                    onClick={() => handleMentionSelect(user)}
                                >
                                    <div>{user.name}</div>
                                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                                        {user.email}
                                    </div>
                                </MentionSuggestion>
                            ))}
                        </MentionSuggestions>
                    )}
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
                            type="submit"
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