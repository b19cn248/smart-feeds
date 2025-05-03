// src/components/features/folder/FolderForm/FolderForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FOLDER_COLORS } from '../../../../constants';
import { FolderFormData } from '../../../../types';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

interface FolderFormProps {
    initialData?: Partial<FolderFormData>;
    onSubmit: (data: FolderFormData) => void;
    onCancel: () => void;
    submitLabel?: string;
}

export const FolderForm: React.FC<FolderFormProps> = ({
                                                          initialData,
                                                          onSubmit,
                                                          onCancel,
                                                          submitLabel = 'Create'
                                                      }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [color, setColor] = useState(initialData?.color || FOLDER_COLORS[0].value);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Folder name is required');
            return;
        }

        onSubmit({
            name: name.trim(),
            color
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
            <div>
                <Input
                    label="Folder name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter folder name"
                    error={error}
                    autoFocus
                />
            </div>

            <div>
                <FormLabel>Color</FormLabel>
                <ColorPicker>
                    {FOLDER_COLORS.map((colorOption) => (
                        <ColorOption
                            key={colorOption.value}
                            type="button"
                            color={colorOption.value}
                            isSelected={color === colorOption.value}
                            onClick={() => setColor(colorOption.value)}
                            aria-label={`Select ${colorOption.name} color`}
                        />
                    ))}
                </ColorPicker>
            </div>

            <ButtonGroup>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                >
                    {submitLabel}
                </Button>
            </ButtonGroup>
        </Form>
    );
};
