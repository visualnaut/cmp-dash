import React from 'react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading operational data...',
  rows = 5,
}) => {
  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center gap-3 text-base-content/60 font-medium text-sm">
        <span className="loading loading-spinner loading-md text-primary" />
        <span>{message}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
};
