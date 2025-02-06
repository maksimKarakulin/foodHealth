'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/Alert'

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught error in ErrorBoundary", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong.</AlertTitle>
          <AlertDescription>
            {this.state.error && this.state.error.message}
            <br />
            Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary>Error Details</summary>
              <p>{this.state.errorInfo.componentStack}</p>
            </details>
          )}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
