'use client';

import React from 'react';
import type { ErrorBoundaryProps } from '../../types';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{
  error: Error;
  retry: () => void;
}> = ({ error, retry }) => (
  <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-center">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-sm text-red-700 mb-6 max-w-sm">
        {process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={retry}
          aria-label="Try again"
        >
          Try Again
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => window.location.reload()}
          aria-label="Refresh page"
        >
          Refresh Page
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
            Technical Details
          </summary>
          <pre className="mt-2 text-xs text-red-900 bg-red-100 p-3 rounded border overflow-auto max-w-full">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
);

/**
 * Error Boundary component to catch and handle React errors
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      errorInfo,
    });

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Call error handler if provided
    if (this.props.onError) {
      this.props.onError({
        type: 'UNKNOWN_ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
        retryable: true,
      });
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}