// src/styles/GlobalStyles.tsx
import { createGlobalStyle } from 'styled-components';
import { customScrollbar } from './mixins';

export const GlobalStyles = createGlobalStyle`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
        }

        html {
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
        }

        body {
                font-family: ${({ theme }) => theme.typography.fontFamily};
                background-color: ${({ theme }) => theme.colors.background.primary};
                color: ${({ theme }) => theme.colors.text.primary};
                line-height: ${({ theme }) => theme.typography.lineHeight.normal};
                ${customScrollbar};
                transition: background-color 0.3s ease, color 0.3s ease;
        }

        a {
                color: inherit;
                text-decoration: none;
        }

        button {
                font-family: inherit;
                cursor: pointer;
        }

        img {
                max-width: 100%;
                display: block;
        }

        ul, ol {
                list-style: none;
        }

        input, textarea, select {
                font-family: inherit;
        }

        /* Focus styles */
        *:focus {
                outline: 2px solid ${({ theme }) => theme.colors.primary.main};
                outline-offset: 2px;
        }

        *:focus:not(:focus-visible) {
                outline: none;
        }

        /* Animations */
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

        @keyframes slideIn {
                from {
                        transform: translateX(-100%);
                }
                to {
                        transform: translateX(0);
                }
        }

        @keyframes spin {
                to {
                        transform: rotate(360deg);
                }
        }

        /* Utility classes */
        .fade-in {
                animation: fadeIn 0.3s ease-in-out;
        }

        .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
        }
`;