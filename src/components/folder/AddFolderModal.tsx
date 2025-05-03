import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
`;

const ModalContainer = styled.div<{ isOpen: boolean }>`
  background-color: white;
  border-radius: var(--border-radius-lg);
  width: 440px;
  max-width: 90%;
  box-shadow: var(--shadow-lg);
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: transform 0.3s, opacity 0.3s;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: #1E293B;
  }
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid var(--light-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--dark-gray);
  transition: var(--transition);

  &:hover {
    background-color: var(--light-gray);
    color: var(--darker-gray);
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.hasError ? 'var(--error)' : 'var(--medium-gray)'};
  border-radius: var(--border-radius);
  font-size: 14px;
  transition: var(--transition);
  color: var(--text-primary);
  background-color: white;

  &:focus {
    border-color: ${props => props.hasError ? 'var(--error)' : 'var(--primary)'};
    outline: none;
    box-shadow: ${props => props.hasError
    ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
    : '0 0 0 3px rgba(46, 124, 246, 0.1)'};
  }

  &::placeholder {
    color: var(--dark-gray);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1E293B;
    border-color: ${props => props.hasError ? 'var(--error)' : 'var(--medium-gray)'};
  }
`;

const ErrorText = styled.div`
  color: var(--error);
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;

  i {
    margin-right: 6px;
    font-size: 12px;
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const ColorOption = styled.div<{ color: string; isSelected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid ${props => props.isSelected ? 'var(--medium-gray)' : 'white'};
  background-color: ${props => props.color};
  box-shadow: var(--shadow-sm);
  position: relative;
  transform: ${props => props.isSelected ? 'scale(1.1)' : 'scale(1)'};

  &:hover {
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    box-shadow: var(--shadow-sm);
    opacity: ${props => props.isSelected ? 1 : 0};
  }

  &::before {
    content: '\\f00c';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--primary);
    font-size: 10px;
    z-index: 1;
    opacity: ${props => props.isSelected ? 1 : 0};
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${props => props.isSelected ? 'var(--medium-gray)' : '#1E293B'};
    
    &::after {
      background-color: #1E293B;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid var(--light-gray);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: var(--light-bg);

  @media (prefers-color-scheme: dark) {
    background-color: #0F172A;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
  white-space: nowrap;
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: var(--text-secondary);
  border: 1px solid var(--medium-gray);

  &:hover {
    background-color: var(--light-gray);
    color: var(--text-primary);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #334155;
    color: white;
    border-color: transparent;
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--primary);
  color: white;
  border: none;

  &:hover {
    background-color: var(--primary-hover);
    box-shadow: var(--shadow);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const colorOptions = [
    '#2E7CF6', // blue
    '#F43F5E', // red
    '#10B981', // green
    '#FBBF24', // yellow
    '#8B5CF6', // purple
    '#EC4899', // pink
];

interface AddFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, color: string) => void;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({ isOpen, onClose, onSave }) => {
    const [folderName, setFolderName] = useState('');
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
    const [nameError, setNameError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Focus input when modal opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (folderName.trim() === '') {
            setNameError('Folder name is required');
            return;
        }

        onSave(folderName.trim(), selectedColor);
        resetForm();
    };

    const resetForm = () => {
        setFolderName('');
        setSelectedColor(colorOptions[0]);
        setNameError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
        if (e.target.value.trim() !== '') {
            setNameError('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleClose();
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <ModalContainer isOpen={isOpen}>
                <ModalHeader>
                    <ModalTitle>Create new folder</ModalTitle>
                    <CloseButton onClick={handleClose}>&times;</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <FormLabel htmlFor="folderName">Folder name</FormLabel>
                        <FormInput
                            id="folderName"
                            ref={inputRef}
                            type="text"
                            placeholder="Enter folder name (e.g. Sports, Entertainment)"
                            value={folderName}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            hasError={!!nameError}
                        />
                        {nameError && (
                            <ErrorText>
                                <i className="fas fa-exclamation-circle"></i>
                                {nameError}
                            </ErrorText>
                        )}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Color</FormLabel>
                        <ColorPicker>
                            {colorOptions.map((color, index) => (
                                <ColorOption
                                    key={index}
                                    color={color}
                                    isSelected={selectedColor === color}
                                    onClick={() => setSelectedColor(color)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setSelectedColor(color);
                                        }
                                    }}
                                />
                            ))}
                        </ColorPicker>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <CancelButton onClick={handleClose}>Cancel</CancelButton>
                    <SaveButton onClick={handleSave}>Create folder</SaveButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default AddFolderModal;