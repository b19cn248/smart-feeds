// src/styles/mixins/index.ts
import { css } from 'styled-components';
import { Theme } from '../theme';

// Flex mixins
export const flexCenter = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const flexBetween = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const flexColumn = css`
    display: flex;
    flex-direction: column;
`;

// Card styles
export const cardStyle = css<{ theme: Theme }>`
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition: ${({ theme }) => theme.transitions.default};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
        border-color: ${({ theme }) => theme.colors.gray[300]};
    }

    @media (prefers-color-scheme: dark) {
        background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
        border-color: ${({ theme }) => theme.colors.gray[700]};
    }
`;

// Button styles
export const buttonReset = css`
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    color: inherit;

    &:focus {
        outline: none;
    }
`;

// Input styles
export const inputStyle = (hasError: boolean = false) => css`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 1px solid ${({ theme }) =>
    hasError ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: ${({ theme }) => theme.transitions.default};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.secondary};

  &:focus {
    border-color: ${({ theme }) =>
    hasError ? theme.colors.error : theme.colors.primary.main};
    outline: none;
    box-shadow: ${({ theme }) =>
    hasError
        ? `0 0 0 3px ${theme.colors.error}20`
        : `0 0 0 3px ${theme.colors.primary.main}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) =>
    hasError ? theme.colors.error : theme.colors.gray[600]};
  }
`;

// Typography mixins
export const truncate = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const lineClamp = (lines: number) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

// Animation mixins
export const fadeIn = css`
    animation: fadeIn ${({ theme }) => theme.transitions.default};

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const slideIn = css`
    animation: slideIn ${({ theme }) => theme.transitions.default};

    @keyframes slideIn {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0);
        }
    }
`;

// Responsive mixins
export const hideOnMobile = css`
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: none;
    }
`;

export const showOnMobile = css`
    display: none;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: block;
    }
`;

// Scrollbar styles
export const customScrollbar = css`
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.gray[300]} transparent;

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.gray[300]};
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: content-box;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: ${({ theme }) => theme.colors.gray[400]};
    }
`;

// Focus styles
export const focusRing = css`
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}20;
    }

    &:focus:not(:focus-visible) {
        box-shadow: none;
    }
`;

// Grid system
export const gridContainer = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

// Overlay styles
export const overlay = css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: ${({ theme }) => theme.zIndices.overlay};
`;

// Badge styles
export const badge = css`
    display: inline-flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: ${({ theme }) => theme.radii.full};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// Icon button styles
export const iconButton = css`
    ${buttonReset}
    ${flexCenter}
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.gray[600]};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray[100]};
        color: ${({ theme }) => theme.colors.gray[900]};
    }

    &:active {
        background-color: ${({ theme }) => theme.colors.gray[200]};
    }

    @media (prefers-color-scheme: dark) {
        color: ${({ theme }) => theme.colors.gray[400]};

        &:hover {
            background-color: ${({ theme }) => theme.colors.gray[800]};
            color: ${({ theme }) => theme.colors.gray[100]};
        }

        &:active {
            background-color: ${({ theme }) => theme.colors.gray[700]};
        }
    }
`;

// Glass effect
export const glassEffect = css`
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    @media (prefers-color-scheme: dark) {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
`;

// Gradient background
export const gradientBackground = css`
    background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);

    @media (prefers-color-scheme: dark) {
        background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
    }
`;

// Link styles
export const linkStyle = css`
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        text-decoration: underline;
        color: ${({ theme }) => theme.colors.primary.hover};
    }

    &:focus {
        outline: none;
        text-decoration: underline;
    }
`;

// Container styles
export const containerStyle = css`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: 0 ${({ theme }) => theme.spacing.lg};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        padding: 0 ${({ theme }) => theme.spacing.md};
    }
`;

// Sidebar layout
export const sidebarLayout = css`
    display: flex;
    min-height: 100vh;

    .sidebar {
        width: 260px;
        position: fixed;
        height: 100vh;
        transition: ${({ theme }) => theme.transitions.default};

        @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
            transform: translateX(-100%);
            z-index: ${({ theme }) => theme.zIndices.fixed};

            &.active {
                transform: translateX(0);
            }
        }
    }

    .main-content {
        margin-left: 260px;
        flex: 1;
        min-width: 0;
        transition: ${({ theme }) => theme.transitions.default};

        @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
            margin-left: 0;
        }
    }
`;

// Utility function to apply responsive styles
export const responsive = (
    styles: Record<string, any>,
    breakpoint: keyof Theme['breakpoints']
) => css`
    @media (min-width: ${({ theme }) => theme.breakpoints[breakpoint]}) {
        ${Object.entries(styles)
                .map(([property, value]) => `${property}: ${value};`)
                .join('\n')}
    }
`;

// Hover lift effect
export const hoverLift = css`
    transition: transform ${({ theme }) => theme.transitions.default},
    box-shadow ${({ theme }) => theme.transitions.default};

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }

    &:active {
        transform: translateY(0);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
`;

// Text gradient
export const textGradient = (gradient: string) => css`
    background: ${gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

// Skeleton loading animation
export const skeleton = css`
    background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.gray[200]} 0px,
            ${({ theme }) => theme.colors.gray[100]} 40px,
            ${({ theme }) => theme.colors.gray[200]} 80px
    );
    background-size: 200% 100%;
    animation: skeleton 1.2s ease-in-out infinite;

    @keyframes skeleton {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    @media (prefers-color-scheme: dark) {
        background: linear-gradient(
                90deg,
                ${({ theme }) => theme.colors.gray[800]} 0px,
                ${({ theme }) => theme.colors.gray[700]} 40px,
                ${({ theme }) => theme.colors.gray[800]} 80px
        );
    }
`;

// Pulse animation
export const pulse = css`
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
`;

// Disabled state
export const disabled = css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
`;

// Visually hidden but accessible
export const visuallyHidden = css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

// Tooltip styles
export const tooltip = css`
    position: relative;

    &::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
        padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
        background-color: ${({ theme }) => theme.colors.gray[900]};
        color: white;
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        border-radius: ${({ theme }) => theme.radii.sm};
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: ${({ theme }) => theme.transitions.fast};
        z-index: ${({ theme }) => theme.zIndices.tooltip};
    }

    &:hover::after {
        opacity: 1;
        visibility: visible;
    }
`;

// Rotate animation
export const rotate = css`
    animation: rotate 1s linear infinite;

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

// Shake animation
export const shake = css`
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;

    @keyframes shake {
        10%, 90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%, 80% {
            transform: translate3d(2px, 0, 0);
        }
        30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%, 60% {
            transform: translate3d(4px, 0, 0);
        }
    }
`;

export default {
    flexCenter,
    flexBetween,
    flexColumn,
    cardStyle,
    buttonReset,
    inputStyle,
    truncate,
    lineClamp,
    fadeIn,
    slideIn,
    hideOnMobile,
    showOnMobile,
    customScrollbar,
    focusRing,
    gridContainer,
    overlay,
    badge,
    iconButton,
    glassEffect,
    gradientBackground,
    linkStyle,
    containerStyle,
    sidebarLayout,
    responsive,
    hoverLift,
    textGradient,
    skeleton,
    pulse,
    disabled,
    visuallyHidden,
    tooltip,
    rotate,
    shake,
};