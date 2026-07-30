import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  title?: string;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SectionErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="card bg-base-100 shadow-sm border border-error/20 p-6 rounded-2xl">
          <div className="flex flex-col items-center text-center space-y-3 py-2">
            <div className="p-3 bg-error/10 text-error rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-base-content">
                {this.props.title || 'Section Unavailable'}
              </h3>
              <p className="text-xs text-base-content/70 mt-1 max-w-md">
                {this.state.error?.message || 'An unexpected rendering error occurred in this section.'}
              </p>
            </div>
            <button
              onClick={this.handleRetry}
              className="btn btn-xs sm:btn-sm btn-outline btn-error gap-1.5 rounded-xl font-bold mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Section</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
