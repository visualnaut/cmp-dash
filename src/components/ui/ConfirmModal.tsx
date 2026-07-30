import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div
        onClick={onCancel}
        aria-hidden="true"
        className="fixed inset-0"
      />
      <div className="bg-base-100 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-base-200 space-y-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isDanger && (
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0" aria-hidden="true">
                <AlertTriangle className="w-6 h-6" />
              </div>
            )}
            <h3 id="confirm-modal-title" className="text-lg font-bold text-base-content">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close modal dialog"
            className="btn btn-sm btn-ghost btn-circle text-base-content/50 hover:text-base-content"
            disabled={isLoading}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-base-content/70 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3 pt-3 border-t border-base-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn btn-ghost btn-sm font-semibold rounded-xl"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn btn-sm font-semibold rounded-xl text-white ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 border-rose-600'
                : 'btn-primary'
            }`}
          >
            {isLoading ? <span className="loading loading-spinner loading-xs" aria-hidden="true" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
