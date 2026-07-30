import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load orders',
  message = 'Please check your connection or click retry to load the data again.',
  onRetry,
}) => {
  return (
    <div className="card bg-rose-50 border border-rose-200 p-8 text-center max-w-lg mx-auto my-8 rounded-2xl">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-rose-100 rounded-full text-rose-600">
          <AlertCircle className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <div>
          <button
            onClick={onRetry}
            className="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white border-none gap-2 rounded-xl font-semibold px-5 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
