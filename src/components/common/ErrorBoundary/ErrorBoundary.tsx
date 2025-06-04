// src/components/common/ErrorBoundary/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

const ErrorContainer = styled.div`
    padding: 32px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radii.lg};
    border: 2px dashed ${({ theme }) => theme.colors.error};
    margin: 20px 0;
`;

const ErrorIcon = styled.div`
    font-size: 48px;
    color: ${({ theme }) => theme.colors.error};
    margin-bottom: 16px;
`;

const ErrorTitle = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 12px;
`;

const ErrorMessage = styled.p`
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 24px;
`;

const ErrorDetails = styled.details`
    margin: 16px 0;
    text-align: left;
    background-color: ${({ theme }) => theme.colors.gray[100]};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 12px;
`;

const ErrorSummary = styled.summary`
    cursor: pointer;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: 8px;
`;

const ErrorStack = styled.pre`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
`;

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Call onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Update state with error info
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <ErrorContainer>
                    <ErrorIcon>
                        <i className="fas fa-exclamation-triangle" />
                    </ErrorIcon>
                    <ErrorTitle>Something went wrong</ErrorTitle>
                    <ErrorMessage>
                        An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                    </ErrorMessage>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <ErrorDetails>
                            <ErrorSummary>Error Details (Development Mode)</ErrorSummary>
                            <ErrorStack>
                                <strong>Error:</strong> {this.state.error.toString()}
                                {this.state.errorInfo && (
                                    <>
                                        <br /><br />
                                        <strong>Component Stack:</strong>
                                        {this.state.errorInfo.componentStack}
                                    </>
                                )}
                            </ErrorStack>
                        </ErrorDetails>
                    )}

                    <ActionButtons>
                        <Button variant="secondary" onClick={this.handleRetry}>
                            Try Again
                        </Button>
                        <Button onClick={this.handleReload}>
                            Reload Page
                        </Button>
                    </ActionButtons>
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };