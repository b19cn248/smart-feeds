// src/types/common.types.ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: string;
    rightIcon?: string;
    isLoading?: boolean;
    isFullWidth?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: string;
    rightIcon?: string;
    isFullWidth?: boolean;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined';
    padding?: string;
    onClick?: () => void;
    className?: string;
}

export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    className?: string;
}

export type NavItem = {
    id: string;
    icon: string;
    label: string;
    path?: string;
    isActive?: boolean;
};

export type NavSection = {
    title: string;
    items: NavItem[];
};