import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-orange/80 p-4 rounded-xl bg-ink/20 backdrop-blur-sm">
          Something went wrong loading this section.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 