// src/components/features/board/BoardForm/BoardForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { BoardCreateRequest, BoardUpdateRequest } from '../../../../types';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';

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
  margin-bottom: 8px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ColorIconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 12px;
`;

const ColorOption = styled.button<{ color: string; isSelected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${({ isSelected, theme }) =>
    isSelected ? theme.colors.gray[400] : 'transparent'};
  background-color: ${({ color }) => color};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light};
  }

  ${({ isSelected }) => isSelected && `
    &::after {
      content: '\\f00c';
      font-family: 'Font Awesome 6 Free';
      font-weight: 900;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 14px;
    }
  `}
`;

const IconOption = styled.button<{ isSelected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 2px solid ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary.main : theme.colors.gray[200]};
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary.light : theme.colors.background.secondary};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary.main : theme.colors.text.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin-right: 12px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.gray[300]};
  transition: .3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }
`;

const ToggleLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Color options
const COLORS = [
    '#2E7CF6', // blue
    '#F43F5E', // red
    '#10B981', // green
    '#FBBF24', // yellow
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#475569', // gray
    '#0EA5E9', // sky-blue
    '#14B8A6', // teal
    '#F97316', // orange
];

// Icon options
const ICONS = [
    'clipboard',
    'book',
    'newspaper',
    'bookmark',
    'star',
    'heart',
    'folder',
    'tag',
    'lightbulb',
    'bell',
    'inbox',
    'archive'
];

interface BoardFormProps {
    initialData?: Partial<BoardCreateRequest>;
    onSubmit: (data: BoardCreateRequest | BoardUpdateRequest) => void;
    onCancel: () => void;
    submitLabel?: string;
    isLoading?: boolean;
    isEditing?: boolean;
}

export const BoardForm: React.FC<BoardFormProps> = ({
                                                        initialData,
                                                        onSubmit,
                                                        onCancel,
                                                        submitLabel = 'Create',
                                                        isLoading = false,
                                                        isEditing = false
                                                    }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [color, setColor] = useState(initialData?.color || COLORS[0]);
    const [icon, setIcon] = useState(initialData?.icon || ICONS[0]);
    const [isPublic, setIsPublic] = useState(initialData?.is_public || false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Board name is required');
            return;
        }

        onSubmit({
            name: name.trim(),
            description: description.trim() || undefined, // Sửa null thành undefined
            color,
            icon,
            is_public: isPublic
        });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (error) {
            setError('');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Input
                    label="Board name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter board name"
                    error={error}
                    autoFocus
                    disabled={isLoading}
                />
            </FormGroup>

            <FormGroup>
                <Input
                    label="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter board description"
                    disabled={isLoading}
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>Choose a color</FormLabel>
                <ColorIconGrid>
                    {COLORS.map((colorOption) => (
                        <ColorOption
                            key={colorOption}
                            type="button"
                            color={colorOption}
                            isSelected={color === colorOption}
                            onClick={() => setColor(colorOption)}
                            aria-label={`Select color ${colorOption}`}
                            disabled={isLoading}
                        />
                    ))}
                </ColorIconGrid>
            </FormGroup>

            <FormGroup>
                <FormLabel>Choose an icon</FormLabel>
                <ColorIconGrid>
                    {ICONS.map((iconOption) => (
                        <IconOption
                            key={iconOption}
                            type="button"
                            isSelected={icon === iconOption}
                            onClick={() => setIcon(iconOption)}
                            aria-label={`Select icon ${iconOption}`}
                            disabled={isLoading}
                        >
                            <i className={`fas fa-${iconOption}`} />
                        </IconOption>
                    ))}
                </ColorIconGrid>
            </FormGroup>

            <FormGroup>
                <ToggleGroup>
                    <Toggle>
                        <ToggleInput
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => setIsPublic(!isPublic)}
                            disabled={isLoading}
                        />
                        <ToggleSlider />
                    </Toggle>
                    <ToggleLabel>Make this board public</ToggleLabel>
                </ToggleGroup>
            </FormGroup>

            <ButtonGroup>
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
                >
                    {submitLabel}
                </Button>
            </ButtonGroup>
        </Form>
    );
};