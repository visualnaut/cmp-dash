import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No orders found',
  message = 'Try adjusting your search query or filter criteria.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="card bg-base-100 border border-base-200 p-12 text-center max-w-md mx-auto my-8 rounded-2xl">
      <div className="flex justify-center mb-3">
        <div className="p-4 bg-base-200/60 rounded-full text-base-content/40">
          <SearchX className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-base font-bold text-base-content mb-1">{title}</h3>
      <p className="text-xs text-base-content/60 mb-5">{message}</p>
      {actionLabel && onAction && (
        <div>
          <button
            onClick={onAction}
            className="btn btn-sm btn-ghost border-base-300 font-medium rounded-xl"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
